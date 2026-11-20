import { AtemCommandCollector, Commands as AtemCommands, Enums as ConnectionEnums, VideoState } from 'atem-connection'
import type { PartialDeep } from 'type-fest'

import * as Defaults from '../../defaults/index.js'
import { DiffUpstreamKeyer } from '../../diff.js'
import { diffObject, fillDefaults, getAllKeysNumber } from '../../util.js'
import { resolveAdvancedChromaKeyerState, resolveChromaKeyerState } from './chromaKeyer.js'
import { resolveDVEKeyerState } from './dveKeyer.js'
import { resolveFlyKeyerFramesState, resolveFlyPropertiesState } from './flyKey.js'
import { resolveLumaKeyerState } from './lumaKeyer.js'
import { resolvePatternKeyerState } from './patternKeyer.js'

/**
 * @returns Whether the change needs a mix effect transition to be run
 */
export function resolveUpstreamKeyerState(
	commands: AtemCommandCollector,
	mixEffectId: number,
	oldState: PartialDeep<Array<VideoState.USK.UpstreamKeyer | undefined>> | undefined,
	newState: PartialDeep<Array<VideoState.USK.UpstreamKeyer | undefined>> | undefined,
	newStateTransSelection: ConnectionEnums.TransitionSelection[] | undefined,
	diffOptions: DiffUpstreamKeyer | DiffUpstreamKeyer[]
): boolean {
	let doTransition = false

	for (const upstreamKeyerId of getAllKeysNumber(oldState, newState)) {
		const thisDiffOptions = Array.isArray(diffOptions) ? diffOptions[upstreamKeyerId] : diffOptions

		const oldKeyer = fillDefaults(Defaults.Video.UpstreamKeyer(upstreamKeyerId), oldState?.[upstreamKeyerId])
		const newKeyer = fillDefaults(Defaults.Video.UpstreamKeyer(upstreamKeyerId), newState?.[upstreamKeyerId])

		if (thisDiffOptions.mask) {
			resolveUpstreamKeyerMaskState(
				commands,
				mixEffectId,
				upstreamKeyerId,
				oldKeyer.maskSettings,
				newKeyer.maskSettings
			)
		}

		if (thisDiffOptions.dveSettings) {
			resolveDVEKeyerState(commands, mixEffectId, upstreamKeyerId, oldKeyer.dveSettings, newKeyer.dveSettings)
		}
		if (thisDiffOptions.flyKeyframes) {
			resolveFlyKeyerFramesState(
				commands,
				mixEffectId,
				upstreamKeyerId,
				oldKeyer.flyKeyframes,
				newKeyer.flyKeyframes,
				thisDiffOptions.flyKeyframes
			)
		}
		if (thisDiffOptions.flyProperties) {
			resolveFlyPropertiesState(
				commands,
				mixEffectId,
				upstreamKeyerId,
				oldKeyer.flyProperties,
				newKeyer.flyProperties
			)
		}

		if (thisDiffOptions.chromaSettings) {
			resolveChromaKeyerState(
				commands,
				mixEffectId,
				upstreamKeyerId,
				oldKeyer.chromaSettings,
				newKeyer.chromaSettings
			)
		}

		if (thisDiffOptions.advancedChromaSettings) {
			resolveAdvancedChromaKeyerState(
				commands,
				mixEffectId,
				upstreamKeyerId,
				oldKeyer.advancedChromaSettings,
				newKeyer.advancedChromaSettings
			)
		}

		if (thisDiffOptions.lumaSettings) {
			resolveLumaKeyerState(commands, mixEffectId, upstreamKeyerId, oldKeyer.lumaSettings, newKeyer.lumaSettings)
		}

		if (thisDiffOptions.patternSettings) {
			resolvePatternKeyerState(
				commands,
				mixEffectId,
				upstreamKeyerId,
				oldKeyer.patternSettings,
				newKeyer.patternSettings
			)
		}

		if (thisDiffOptions.sources) {
			if (oldKeyer.fillSource !== newKeyer.fillSource) {
				commands.setUpstreamKeyerFillSource(newKeyer.fillSource, mixEffectId, upstreamKeyerId)
			}
			if (oldKeyer.cutSource !== newKeyer.cutSource) {
				commands.setUpstreamKeyerCutSource(newKeyer.cutSource, mixEffectId, upstreamKeyerId)
			}
		}

		if (thisDiffOptions.type) {
			commands.setUpstreamKeyerType(diffObject(oldKeyer, newKeyer), mixEffectId, upstreamKeyerId)
		}

		const transitions = newStateTransSelection?.includes(Math.pow(2, upstreamKeyerId + 1))
		if (thisDiffOptions.onAir && oldKeyer.onAir !== newKeyer.onAir && !transitions) {
			// Built by hand, as the helper can't set the runOrderGroup
			const command = new AtemCommands.MixEffectKeyOnAirCommand(mixEffectId, upstreamKeyerId, newKeyer.onAir)
			command.runOrderGroup = newKeyer.onAir ? 10 : -10 // OnAir command should run after other commands when turning on, and before other commands when turning off
			commands.sendCommand(command)
		} else if (thisDiffOptions.onAir && oldKeyer.onAir !== newKeyer.onAir) {
			doTransition = true
		}
	}

	return doTransition
}

export function resolveUpstreamKeyerMaskState(
	commands: AtemCommandCollector,
	mixEffectId: number,
	upstreamKeyerId: number,
	oldState: PartialDeep<VideoState.USK.UpstreamKeyerMaskSettings>,
	newState: PartialDeep<VideoState.USK.UpstreamKeyerMaskSettings>
): void {
	const oldMask = fillDefaults(Defaults.Video.UpstreamKeyerMask, oldState)
	const newMask = fillDefaults(Defaults.Video.UpstreamKeyerMask, newState)

	commands.setUpstreamKeyerMaskSettings(
		diffObject<VideoState.USK.UpstreamKeyerMaskSettings>(oldMask, newMask),
		mixEffectId,
		upstreamKeyerId
	)
}
