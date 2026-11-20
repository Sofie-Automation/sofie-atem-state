import { PartialDeep } from 'type-fest'
import type { AtemCommandCollector } from 'atem-connection'

import { SectionsToDiff } from '../diff.js'
import { State as StateObject } from '../state.js'
import { resolveAuxiliaries } from './auxiliaries.js'
import { resolveClassicAudioState } from './classic-audio.js'
import { resolveColorState } from './color.js'
import { resolveDownstreamKeyerState } from './downstreamKeyer.js'
import { resolveFairlightAudioState } from './falirlight-audio.js'
import { resolveMacroPlayerState } from './macro.js'
import { resolveMediaPlayerState } from './media.js'
import { resolveMixEffectsState } from './mixEffect.js'
import { resolveMultiviewerState } from './settings/multiviewer.js'
import { resolveSuperSourceState } from './supersource.js'

export function diffState(
	commands: AtemCommandCollector,
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>,
	diffOptions: SectionsToDiff
): void {
	let doTransition = false
	if (diffOptions.video?.downstreamKeyers) {
		doTransition = resolveDownstreamKeyerState(
			commands,
			oldState.video?.downstreamKeyers,
			newState.video?.downstreamKeyers,
			diffOptions.video
		)
	}

	if (diffOptions.video?.mixEffects) {
		resolveMixEffectsState(
			commands,
			oldState.video?.mixEffects,
			newState.video?.mixEffects,
			diffOptions.video.mixEffects,
			doTransition
		)
	}

	if (diffOptions.macros?.player) {
		resolveMacroPlayerState(
			commands,
			oldState.macro?.macroPlayer,
			newState.macro?.macroPlayer,
			diffOptions.macros.player
		)
	}

	if (diffOptions.video?.superSources) {
		resolveSuperSourceState(
			commands,
			oldState.video?.superSources,
			newState.video?.superSources,
			diffOptions.video.superSources
		)
	}

	if (diffOptions.audio?.classic) {
		resolveClassicAudioState(commands, oldState.audio, newState.audio, diffOptions.audio.classic)
	}
	if (diffOptions.audio?.fairlight) {
		resolveFairlightAudioState(commands, oldState.fairlight, newState.fairlight, diffOptions.audio.fairlight)
	}

	if (diffOptions.media?.players) {
		resolveMediaPlayerState(commands, oldState.media?.players, newState.media?.players, diffOptions.media.players)
	}

	if (diffOptions.colorGenerators && diffOptions.colorGenerators.length) {
		resolveColorState(commands, oldState.colorGenerators, newState.colorGenerators, diffOptions.colorGenerators)
	}

	if (diffOptions.settings?.multiviewer) {
		resolveMultiviewerState(
			commands,
			oldState.settings?.multiViewers,
			newState.settings?.multiViewers,
			diffOptions.settings.multiviewer
		)
	}

	if (diffOptions.video?.auxiliaries && diffOptions.video.auxiliaries.length) {
		resolveAuxiliaries(
			commands,
			oldState.video?.auxilliaries,
			newState.video?.auxilliaries,
			diffOptions.video.auxiliaries
		)
	}
}
