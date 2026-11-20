import type { AtemCommandCollector, VideoState } from 'atem-connection'
import type { PartialDeep } from 'type-fest'

import * as Defaults from '../../defaults/index.js'
import { diffObject, fillDefaults } from '../../util.js'

export function resolveLumaKeyerState(
	commands: AtemCommandCollector,
	mixEffectId: number,
	upstreamKeyerId: number,
	oldState: PartialDeep<VideoState.USK.UpstreamKeyerLumaSettings> | undefined,
	newState: PartialDeep<VideoState.USK.UpstreamKeyerLumaSettings> | undefined
): void {
	if (!oldState && !newState) return

	const oldLumaKeyer = fillDefaults(Defaults.Video.UpstreamKeyerLumaSettings, oldState)
	const newLumaKeyer = fillDefaults(Defaults.Video.UpstreamKeyerLumaSettings, newState)

	commands.setUpstreamKeyerLumaSettings(diffObject(oldLumaKeyer, newLumaKeyer), mixEffectId, upstreamKeyerId)
}
