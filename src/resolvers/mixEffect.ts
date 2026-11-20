import { AtemCommandCollector, Enums as ConnectionEnums, VideoState } from 'atem-connection'
import type { PartialDeep } from 'type-fest'

import * as Defaults from '../defaults/index.js'
import { DiffMixEffect, DiffMixEffectTransitionSettings } from '../diff.js'
import * as Enums from '../enums.js'
import { MixEffect } from '../state.js'
import { diffObject, fillDefaults, getAllKeysNumber } from '../util.js'
import { resolveUpstreamKeyerState } from './upstreamKeyers/index.js'

export function resolveMixEffectsState(
	commands: AtemCommandCollector,
	oldState: PartialDeep<Array<MixEffect | undefined>> | undefined,
	newState: PartialDeep<Array<MixEffect | undefined>> | undefined,
	diffOptions: DiffMixEffect | DiffMixEffect[],
	dskTransition = false
): void {
	for (const mixEffectId of getAllKeysNumber(oldState, newState)) {
		const thisDiffOptions = Array.isArray(diffOptions) ? diffOptions[mixEffectId] : diffOptions

		const oldMixEffect = oldState?.[mixEffectId]
		const newMixEffect = newState?.[mixEffectId]
		let doTransition = dskTransition

		if (thisDiffOptions.transitionProperties) {
			resolveTransitionPropertiesState(
				commands,
				mixEffectId,
				oldMixEffect?.transitionProperties,
				newMixEffect?.transitionProperties
			)
		}

		if (thisDiffOptions.transitionSettings) {
			resolveTransitionSettingsState(
				commands,
				mixEffectId,
				oldMixEffect?.transitionSettings,
				newMixEffect?.transitionSettings,
				thisDiffOptions.transitionSettings
			)
		}

		if (thisDiffOptions.upstreamKeyers) {
			const uskTransition = resolveUpstreamKeyerState(
				commands,
				mixEffectId,
				oldMixEffect?.upstreamKeyers,
				newMixEffect?.upstreamKeyers,
				thisDiffOptions.programPreview ? newMixEffect?.transitionProperties?.nextSelection : undefined,
				thisDiffOptions.upstreamKeyers
			)
			doTransition = uskTransition || dskTransition
		}

		if (thisDiffOptions.programPreview) {
			const programInput = newMixEffect?.input ?? newMixEffect?.programInput ?? Defaults.Video.defaultInput
			const oldProgramInput = oldMixEffect?.input ?? oldMixEffect?.programInput ?? Defaults.Video.defaultInput
			const transition = newMixEffect?.transition ?? Enums.TransitionStyle.CUT

			const nextSelection =
				newMixEffect?.transitionProperties?.nextSelection ?? Defaults.Video.TransitionProperties.nextSelection
			const transitionIsBg =
				nextSelection.length === 0 || // note - can't set empty array in atem so use defaults anyway
				!!nextSelection?.find((layer) => layer === ConnectionEnums.TransitionSelection.Background)
			doTransition =
				doTransition || (programInput !== oldProgramInput && transition !== Enums.TransitionStyle.CUT)

			if (programInput !== oldProgramInput && (!transitionIsBg || !doTransition)) {
				commands.changeProgramInput(programInput, mixEffectId)
			}

			if (doTransition) {
				if (transitionIsBg) {
					commands.changePreviewInput(programInput, mixEffectId)
				}

				switch (transition) {
					// cut to new source
					case Enums.TransitionStyle.CUT:
						commands.cut(mixEffectId)
						break

					// dummy means we don't run the transition but only set the preview
					case Enums.TransitionStyle.DUMMY:
						break

					// run transitions to new source
					default:
						if (transition !== (oldMixEffect?.transition ?? oldMixEffect?.transitionProperties?.style)) {
							// set style before auto transition command
							commands.setTransitionStyle(
								{ nextStyle: transition as ConnectionEnums.TransitionStyle },
								mixEffectId
							)
						}

						commands.setTransitionPosition(0, mixEffectId)
						commands.autoTransition(mixEffectId)
				}
			}

			const previewInput = newMixEffect?.previewInput ?? Defaults.Video.defaultInput
			const oldPreviewInput = oldMixEffect?.previewInput ?? Defaults.Video.defaultInput
			if (
				(oldProgramInput === programInput || !doTransition || transition === Enums.TransitionStyle.CUT) &&
				previewInput !== oldPreviewInput
			) {
				// set preview when there is no auto transition command
				commands.changePreviewInput(previewInput, mixEffectId)
			}
		}

		if (thisDiffOptions.transitionStatus) {
			if (
				newMixEffect?.transitionPosition?.inTransition &&
				oldMixEffect?.transitionPosition?.handlePosition !== newMixEffect.transitionPosition.handlePosition
			) {
				commands.setTransitionPosition(newMixEffect?.transitionPosition?.handlePosition ?? 0, mixEffectId)
			}
			if (oldMixEffect?.transitionPosition?.inTransition && !newMixEffect?.transitionPosition?.inTransition) {
				commands.setTransitionPosition(10000, mixEffectId) // finish transition
			}

			if ((oldMixEffect?.transitionPreview ?? false) !== (newMixEffect?.transitionPreview ?? false)) {
				commands.previewTransition(newMixEffect?.transitionPreview ?? false, mixEffectId)
			}
		}

		// @todo: fadeToBlack
	}
}

export function resolveTransitionPropertiesState(
	commands: AtemCommandCollector,
	mixEffectId: number,
	oldState: PartialDeep<VideoState.TransitionProperties> | undefined,
	newState: PartialDeep<VideoState.TransitionProperties> | undefined
): void {
	const oldTransitionProperties = fillDefaults(Defaults.Video.TransitionProperties, oldState)
	const newTransitionProperties = fillDefaults(Defaults.Video.TransitionProperties, newState)

	commands.setTransitionStyle(diffObject(oldTransitionProperties, newTransitionProperties), mixEffectId)
}

export function resolveTransitionSettingsState(
	commands: AtemCommandCollector,
	mixEffectId: number,
	oldTransitionSettings: PartialDeep<VideoState.TransitionSettings> | undefined,
	newTransitionSettings: PartialDeep<VideoState.TransitionSettings> | undefined,
	diffOptions: DiffMixEffectTransitionSettings
): void {
	if (diffOptions.dip && (newTransitionSettings?.dip || oldTransitionSettings?.dip)) {
		const dipProperties = diffObject(
			fillDefaults(Defaults.Video.DipTransitionSettings, oldTransitionSettings?.dip),
			fillDefaults(Defaults.Video.DipTransitionSettings, newTransitionSettings?.dip)
		)
		commands.setDipTransitionSettings(dipProperties, mixEffectId)
	}

	if (diffOptions.DVE && (newTransitionSettings?.DVE || oldTransitionSettings?.DVE)) {
		const dveProperties = diffObject(
			fillDefaults(Defaults.Video.DVETransitionSettings, oldTransitionSettings?.DVE),
			fillDefaults(Defaults.Video.DVETransitionSettings, newTransitionSettings?.DVE)
		)
		commands.setDVETransitionSettings(dveProperties, mixEffectId)
	}

	if (diffOptions.mix && (newTransitionSettings?.mix || oldTransitionSettings?.mix)) {
		const oldProps = fillDefaults(Defaults.Video.MixTransitionSettings, oldTransitionSettings?.mix)
		const newProps = fillDefaults(Defaults.Video.MixTransitionSettings, newTransitionSettings?.mix)
		if (oldProps.rate !== newProps.rate) {
			commands.setMixTransitionSettings({ rate: newProps.rate }, mixEffectId)
		}
	}

	if (diffOptions.stinger && (newTransitionSettings?.stinger || oldTransitionSettings?.stinger)) {
		const stingerProperties = diffObject(
			fillDefaults(Defaults.Video.StingerTransitionSettings, oldTransitionSettings?.stinger),
			fillDefaults(Defaults.Video.StingerTransitionSettings, newTransitionSettings?.stinger)
		)
		commands.setStingerTransitionSettings(stingerProperties, mixEffectId)
	}

	if (diffOptions.wipe && (newTransitionSettings?.wipe || oldTransitionSettings?.wipe)) {
		const wipeProperties = diffObject(
			fillDefaults(Defaults.Video.WipeTransitionSettings, oldTransitionSettings?.wipe),
			fillDefaults(Defaults.Video.WipeTransitionSettings, newTransitionSettings?.wipe)
		)
		commands.setWipeTransitionSettings(wipeProperties, mixEffectId)
	}
}
