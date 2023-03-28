import { Commands as AtemCommands, Enums } from 'atem-connection'
import { State as StateObject } from '../state'
import { resolveMixEffectsState } from './mixEffect'
import { resolveDownstreamKeyerState } from './downstreamKeyer'
import { resolveSuperSourceState } from './supersource'
import { resolveClassicAudioState } from './classic-audio'
import { resolveMacroPlayerState } from './macro'
import { resolveMediaPlayerState } from './media'
import { PartialDeep } from 'type-fest'
import { resolveColorState } from './color'
import { resolveMultiviewerState } from './settings/multiviewer'
import { resolveFairlightAudioState } from './falirlight-audio'
import { SectionsToDiff } from '../diff'
import { resolveAuxiliaries } from './auxiliaries'

export function diffState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>,
	diffOptions: SectionsToDiff,
	version: Enums.ProtocolVersion
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (diffOptions.video?.mixEffects) {
		commands.push(
			...resolveMixEffectsState(oldState.video?.mixEffects, newState.video?.mixEffects, diffOptions.video.mixEffects)
		)
	}

	if (diffOptions.macros?.player) {
		commands.push(
			...resolveMacroPlayerState(oldState.macro?.macroPlayer, newState.macro?.macroPlayer, diffOptions.macros.player)
		)
	}

	if (diffOptions.video?.downstreamKeyers) {
		commands.push(
			...resolveDownstreamKeyerState(
				oldState.video?.downstreamKeyers,
				newState.video?.downstreamKeyers,
				diffOptions.video.downstreamKeyers
			)
		)
	}
	if (diffOptions.video?.superSources) {
		commands.push(
			...resolveSuperSourceState(
				oldState.video?.superSources,
				newState.video?.superSources,
				version,
				diffOptions.video.superSources
			)
		)
	}

	if (diffOptions.audio?.classic) {
		commands.push(...resolveClassicAudioState(oldState.audio, newState.audio, diffOptions.audio.classic))
	}
	if (diffOptions.audio?.fairlight) {
		commands.push(
			...resolveFairlightAudioState(oldState.fairlight, newState.fairlight, version, diffOptions.audio.fairlight)
		)
	}

	if (diffOptions.media?.players) {
		commands.push(
			...resolveMediaPlayerState(oldState.media?.players, newState.media?.players, diffOptions.media.players)
		)
	}

	if (diffOptions.colorGenerators && diffOptions.colorGenerators.length) {
		commands.push(...resolveColorState(oldState.colorGenerators, newState.colorGenerators, diffOptions.colorGenerators))
	}

	if (diffOptions.settings?.multiviewer) {
		commands.push(
			...resolveMultiviewerState(
				oldState.settings?.multiViewers,
				newState.settings?.multiViewers,
				diffOptions.settings.multiviewer
			)
		)
	}

	if (diffOptions.video?.auxiliaries && diffOptions.video.auxiliaries.length) {
		commands.push(
			...resolveAuxiliaries(oldState.video?.auxilliaries, newState.video?.auxilliaries, diffOptions.video.auxiliaries)
		)
	}

	return commands
}
