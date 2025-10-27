import { Commands as AtemCommands, VideoState } from 'atem-connection'
import { resolveDVEKeyerState } from './dveKeyer'
import { resolveAdvancedChromaKeyerState, resolveChromaKeyerState } from './chromaKeyer'
import { resolveLumaKeyerState } from './lumaKeyer'
import { resolvePatternKeyerState } from './patternKeyer'
import { getAllKeysNumber, diffObject, fillDefaults } from '../../util'
import { PartialDeep } from 'type-fest'
import * as Defaults from '../../defaults'
import { resolveFlyKeyerFramesState, resolveFlyPropertiesState } from './flyKey'
import { DiffUpstreamKeyer } from '../../diff'

export function resolveUpstreamKeyerState(
	mixEffectId: number,
	oldState: PartialDeep<Array<VideoState.USK.UpstreamKeyer | undefined>> | undefined,
	newState: PartialDeep<Array<VideoState.USK.UpstreamKeyer | undefined>> | undefined,
	diffOptions: DiffUpstreamKeyer | DiffUpstreamKeyer[]
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const upstreamKeyerId of getAllKeysNumber(oldState, newState)) {
		const thisDiffOptions = Array.isArray(diffOptions) ? diffOptions[upstreamKeyerId] : diffOptions

		const oldKeyer = fillDefaults(Defaults.Video.UpstreamKeyer(upstreamKeyerId), oldState?.[upstreamKeyerId])
		const newKeyer = fillDefaults(Defaults.Video.UpstreamKeyer(upstreamKeyerId), newState?.[upstreamKeyerId])

		if (thisDiffOptions.mask) {
			commands.push(
				...resolveUpstreamKeyerMaskState(mixEffectId, upstreamKeyerId, oldKeyer.maskSettings, newKeyer.maskSettings)
			)
		}

		if (thisDiffOptions.dveSettings) {
			commands.push(...resolveDVEKeyerState(mixEffectId, upstreamKeyerId, oldKeyer.dveSettings, newKeyer.dveSettings))
		}
		if (thisDiffOptions.flyKeyframes) {
			commands.push(
				...resolveFlyKeyerFramesState(
					mixEffectId,
					upstreamKeyerId,
					oldKeyer.flyKeyframes,
					newKeyer.flyKeyframes,
					thisDiffOptions.flyKeyframes
				)
			)
		}
		if (thisDiffOptions.flyProperties) {
			commands.push(
				...resolveFlyPropertiesState(mixEffectId, upstreamKeyerId, oldKeyer.flyProperties, newKeyer.flyProperties)
			)
		}

		if (thisDiffOptions.chromaSettings) {
			commands.push(
				...resolveChromaKeyerState(mixEffectId, upstreamKeyerId, oldKeyer.chromaSettings, newKeyer.chromaSettings)
			)
		}

		if (thisDiffOptions.advancedChromaSettings) {
			commands.push(
				...resolveAdvancedChromaKeyerState(
					mixEffectId,
					upstreamKeyerId,
					oldKeyer.advancedChromaSettings,
					newKeyer.advancedChromaSettings
				)
			)
		}

		if (thisDiffOptions.lumaSettings) {
			commands.push(
				...resolveLumaKeyerState(mixEffectId, upstreamKeyerId, oldKeyer.lumaSettings, newKeyer.lumaSettings)
			)
		}

		if (thisDiffOptions.patternSettings) {
			commands.push(
				...resolvePatternKeyerState(mixEffectId, upstreamKeyerId, oldKeyer.patternSettings, newKeyer.patternSettings)
			)
		}

		if (thisDiffOptions.sources) {
			if (oldKeyer.fillSource !== newKeyer.fillSource) {
				commands.push(
					new AtemCommands.MixEffectKeyFillSourceSetCommand(mixEffectId, upstreamKeyerId, newKeyer.fillSource)
				)
			}
			if (oldKeyer.cutSource !== newKeyer.cutSource) {
				commands.push(
					new AtemCommands.MixEffectKeyCutSourceSetCommand(mixEffectId, upstreamKeyerId, newKeyer.cutSource)
				)
			}
		}

		if (thisDiffOptions.type) {
			const typeProps = diffObject(oldKeyer, newKeyer)
			const command = new AtemCommands.MixEffectKeyTypeSetCommand(mixEffectId, upstreamKeyerId)
			if (command.updateProps(typeProps)) {
				commands.push(command)
			}
		}

		if (thisDiffOptions.onAir && oldKeyer.onAir !== newKeyer.onAir) {
			const command = new AtemCommands.MixEffectKeyOnAirCommand(mixEffectId, upstreamKeyerId, newKeyer.onAir)
			command.runOrderGroup = newKeyer.onAir ? 10 : -10 // OnAir command should run after other commands when turning on, and before other commands when turning off
			commands.push(command)
		}
	}

	return commands
}

export function resolveUpstreamKeyerMaskState(
	mixEffectId: number,
	upstreamKeyerId: number,
	oldState: PartialDeep<VideoState.USK.UpstreamKeyerMaskSettings>,
	newState: PartialDeep<VideoState.USK.UpstreamKeyerMaskSettings>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	const oldMask = fillDefaults(Defaults.Video.UpstreamKeyerMask, oldState)
	const newMask = fillDefaults(Defaults.Video.UpstreamKeyerMask, newState)

	const props = diffObject<VideoState.USK.UpstreamKeyerMaskSettings>(oldMask, newMask)

	const command = new AtemCommands.MixEffectKeyMaskSetCommand(mixEffectId, upstreamKeyerId)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}
