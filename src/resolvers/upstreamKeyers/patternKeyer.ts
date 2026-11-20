import { PartialDeep } from 'type-fest'
import type { AtemCommandCollector, VideoState } from 'atem-connection'

import * as Defaults from '../../defaults/index.js'
import { diffObject, fillDefaults } from '../../util.js'

export function resolvePatternKeyerState(
	commands: AtemCommandCollector,
	mixEffectId: number,
	upstreamKeyerId: number,
	oldState: PartialDeep<VideoState.USK.UpstreamKeyerPatternSettings> | undefined,
	newState: PartialDeep<VideoState.USK.UpstreamKeyerPatternSettings> | undefined
): void {
	if (!oldState && !newState) return

	const oldPatternKeyer = fillDefaults(Defaults.Video.UpstreamKeyerPatternSettings, oldState)
	const newPatternKeyer = fillDefaults(Defaults.Video.UpstreamKeyerPatternSettings, newState)

	const props = diffObject(oldPatternKeyer, newPatternKeyer)
	if (props && oldPatternKeyer.style !== newPatternKeyer.style) {
		// These can be reset when changing pattern, so enforce they are what we expect
		props.positionX = newPatternKeyer.positionX
		props.positionY = newPatternKeyer.positionY
		props.symmetry = newPatternKeyer.symmetry
	}

	commands.setUpstreamKeyerPatternSettings(props, mixEffectId, upstreamKeyerId)
}
