import type { AtemCommandCollector, VideoState } from 'atem-connection'
import { diffObject, fillDefaults } from '../../util'
import * as Defaults from '../../defaults'
import { PartialDeep } from 'type-fest'

export function resolveDVEKeyerState(
	commands: AtemCommandCollector,
	mixEffectId: number,
	upstreamKeyerId: number,
	oldState: PartialDeep<VideoState.USK.UpstreamKeyerDVESettings> | undefined,
	newState: PartialDeep<VideoState.USK.UpstreamKeyerDVESettings> | undefined
): void {
	if (!oldState && !newState) return

	const oldDVEKeyer = fillDefaults(Defaults.Video.UpstreamKeyerDVESettings, oldState)
	const newDVEKeyer = fillDefaults(Defaults.Video.UpstreamKeyerDVESettings, newState)

	commands.setUpstreamKeyerDVESettings(diffObject(oldDVEKeyer, newDVEKeyer), mixEffectId, upstreamKeyerId)
}
