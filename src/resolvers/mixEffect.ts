import { Commands as AtemCommands, Enums as ConnectionEnums, VideoState } from 'atem-connection'
import { MixEffect } from '../state'
import * as Defaults from '../defaults'
import * as Enums from '../enums'
import { getAllKeysNumber, diffObject, fillDefaults } from '../util'
import { DiffMixEffect, DiffMixEffectTransitionSettings } from '../diff'
import { resolveUpstreamKeyerState } from './upstreamKeyers'
import { PartialDeep } from 'type-fest'

export function resolveMixEffectsState(
	oldState: PartialDeep<Array<MixEffect | undefined>> | undefined,
	newState: PartialDeep<Array<MixEffect | undefined>> | undefined,
	diffOptions: DiffMixEffect | DiffMixEffect[]
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const mixEffectId of getAllKeysNumber(oldState, newState)) {
		const thisDiffOptions = Array.isArray(diffOptions) ? diffOptions[mixEffectId] : diffOptions

		const oldMixEffect = oldState?.[mixEffectId]
		const newMixEffect = newState?.[mixEffectId]

		if (thisDiffOptions.transitionProperties) {
			commands.push(
				...resolveTransitionPropertiesState(
					mixEffectId,
					oldMixEffect?.transitionProperties,
					newMixEffect?.transitionProperties
				)
			)
		}

		if (thisDiffOptions.transitionSettings) {
			commands.push(
				...resolveTransitionSettingsState(
					mixEffectId,
					oldMixEffect?.transitionSettings,
					newMixEffect?.transitionSettings,
					thisDiffOptions.transitionSettings
				)
			)
		}

		if (thisDiffOptions.upstreamKeyers) {
			commands.push(
				...resolveUpstreamKeyerState(
					mixEffectId,
					oldMixEffect?.upstreamKeyers,
					newMixEffect?.upstreamKeyers,
					thisDiffOptions.upstreamKeyers
				)
			)
		}

		if (thisDiffOptions.programPreview) {
			const programInput = newMixEffect?.input ?? newMixEffect?.programInput
			const oldProgramInput = oldMixEffect?.input ?? oldMixEffect?.programInput
			const transition = newMixEffect?.transition ?? Enums.TransitionStyle.CUT
			const canHotCut =
				transition === Enums.TransitionStyle.CUT &&
				!newMixEffect?.transitionProperties?.nextSelection?.find(
					(layer) => layer !== ConnectionEnums.TransitionSelection.Background
				)

			if (programInput !== oldProgramInput) {
				switch (transition) {
					// cut to new source
					case Enums.TransitionStyle.CUT:
						if (canHotCut) {
							commands.push(
								new AtemCommands.ProgramInputCommand(mixEffectId, programInput ?? Defaults.Video.defaultInput)
							)
						} else {
							commands.push(
								new AtemCommands.PreviewInputCommand(mixEffectId, programInput ?? Defaults.Video.defaultInput),
								new AtemCommands.CutCommand(mixEffectId)
							)
						}
						break

					// dummy means we don't run the transition but only set the preview
					case Enums.TransitionStyle.DUMMY:
						commands.push(
							new AtemCommands.PreviewInputCommand(mixEffectId, programInput ?? Defaults.Video.defaultInput)
						)
						break

					// run transitions to new source
					default:
						commands.push(
							new AtemCommands.PreviewInputCommand(mixEffectId, programInput ?? Defaults.Video.defaultInput)
						)
						if (transition !== (oldMixEffect?.transition ?? oldMixEffect?.transitionProperties?.style)) {
							// set style before auto transition command
							const command = new AtemCommands.TransitionPropertiesCommand(mixEffectId)
							command.updateProps({
								nextStyle: transition as ConnectionEnums.TransitionStyle,
							})
							commands.push(command)
						}

						commands.push(new AtemCommands.TransitionPositionCommand(mixEffectId, 0))
						commands.push(new AtemCommands.AutoTransitionCommand(mixEffectId))
				}
			}

			if (
				(oldProgramInput === programInput || canHotCut) &&
				oldMixEffect?.previewInput !== newMixEffect?.previewInput
			) {
				// set preview when there is no auto transition command
				commands.push(
					new AtemCommands.PreviewInputCommand(mixEffectId, newMixEffect?.previewInput ?? Defaults.Video.defaultInput)
				)
			}
		}

		if (thisDiffOptions.transitionStatus) {
			if (
				newMixEffect?.transitionPosition?.inTransition &&
				oldMixEffect?.transitionPosition?.handlePosition !== newMixEffect.transitionPosition.handlePosition
			) {
				commands.push(
					new AtemCommands.TransitionPositionCommand(mixEffectId, newMixEffect?.transitionPosition?.handlePosition ?? 0)
				)
			}
			if (oldMixEffect?.transitionPosition?.inTransition && !newMixEffect?.transitionPosition?.inTransition) {
				commands.push(new AtemCommands.TransitionPositionCommand(mixEffectId, 10000)) // finish transition
			}

			if ((oldMixEffect?.transitionPreview ?? false) !== (newMixEffect?.transitionPreview ?? false)) {
				commands.push(new AtemCommands.PreviewTransitionCommand(mixEffectId, newMixEffect?.transitionPreview ?? false))
			}
		}

		// @todo: fadeToBlack
	}

	return commands
}

export function resolveTransitionPropertiesState(
	mixEffectId: number,
	oldState: PartialDeep<VideoState.TransitionProperties> | undefined,
	newState: PartialDeep<VideoState.TransitionProperties> | undefined
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	const oldTransitionProperties = fillDefaults(Defaults.Video.TransitionProperties, oldState)
	const newTransitionProperties = fillDefaults(Defaults.Video.TransitionProperties, newState)

	const props = diffObject(oldTransitionProperties, newTransitionProperties)
	const command = new AtemCommands.TransitionPropertiesCommand(mixEffectId)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}

export function resolveTransitionSettingsState(
	mixEffectId: number,
	oldTransitionSettings: PartialDeep<VideoState.TransitionSettings> | undefined,
	newTransitionSettings: PartialDeep<VideoState.TransitionSettings> | undefined,
	diffOptions: DiffMixEffectTransitionSettings
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (diffOptions.dip && (newTransitionSettings?.dip || oldTransitionSettings?.dip)) {
		const dipProperties = diffObject(
			fillDefaults(Defaults.Video.DipTransitionSettings, oldTransitionSettings?.dip),
			fillDefaults(Defaults.Video.DipTransitionSettings, newTransitionSettings?.dip)
		)
		const command = new AtemCommands.TransitionDipCommand(mixEffectId)
		if (command.updateProps(dipProperties)) {
			commands.push(command)
		}
	}

	if (diffOptions.DVE && (newTransitionSettings?.DVE || oldTransitionSettings?.DVE)) {
		const dveProperties = diffObject(
			fillDefaults(Defaults.Video.DVETransitionSettings, oldTransitionSettings?.DVE),
			fillDefaults(Defaults.Video.DVETransitionSettings, newTransitionSettings?.DVE)
		)
		const command = new AtemCommands.TransitionDVECommand(mixEffectId)
		if (command.updateProps(dveProperties)) {
			commands.push(command)
		}
	}

	if (diffOptions.mix && (newTransitionSettings?.mix || oldTransitionSettings?.mix)) {
		const oldProps = fillDefaults(Defaults.Video.MixTransitionSettings, oldTransitionSettings?.mix)
		const newProps = fillDefaults(Defaults.Video.MixTransitionSettings, newTransitionSettings?.mix)
		if (oldProps.rate !== newProps.rate) {
			commands.push(new AtemCommands.TransitionMixCommand(mixEffectId, newProps.rate))
		}
	}

	if (diffOptions.stinger && (newTransitionSettings?.stinger || oldTransitionSettings?.stinger)) {
		const stingerProperties = diffObject(
			fillDefaults(Defaults.Video.StingerTransitionSettings, oldTransitionSettings?.stinger),
			fillDefaults(Defaults.Video.StingerTransitionSettings, newTransitionSettings?.stinger)
		)
		const command = new AtemCommands.TransitionStingerCommand(mixEffectId)
		if (command.updateProps(stingerProperties)) {
			commands.push(command)
		}
	}

	if (diffOptions.wipe && (newTransitionSettings?.wipe || oldTransitionSettings?.wipe)) {
		const wipeProperties = diffObject(
			fillDefaults(Defaults.Video.WipeTransitionSettings, oldTransitionSettings?.wipe),
			fillDefaults(Defaults.Video.WipeTransitionSettings, newTransitionSettings?.wipe)
		)
		const command = new AtemCommands.TransitionWipeCommand(mixEffectId)
		if (command.updateProps(wipeProperties)) {
			commands.push(command)
		}
	}

	return commands
}
