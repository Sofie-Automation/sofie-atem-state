import type { AtemCommandCollector, VideoState } from 'atem-connection'
import { diffObject, fillDefaults } from '../../util'
import * as Defaults from '../../defaults'
import { PartialDeep } from 'type-fest'

export function resolveChromaKeyerState(
	commands: AtemCommandCollector,
	mixEffectId: number,
	upstreamKeyerId: number,
	oldState: PartialDeep<VideoState.USK.UpstreamKeyerChromaSettings> | undefined,
	newState: PartialDeep<VideoState.USK.UpstreamKeyerChromaSettings> | undefined
): void {
	if (!oldState && !newState) return

	const oldChromaKeyer = fillDefaults(Defaults.Video.UpstreamKeyerChromaSettings, oldState)
	const newChromaKeyer = fillDefaults(Defaults.Video.UpstreamKeyerChromaSettings, newState)

	commands.setUpstreamKeyerChromaSettings(diffObject(oldChromaKeyer, newChromaKeyer), mixEffectId, upstreamKeyerId)
}

export function resolveAdvancedChromaKeyerState(
	commands: AtemCommandCollector,
	mixEffectId: number,
	upstreamKeyerId: number,
	oldState: PartialDeep<VideoState.USK.UpstreamKeyerAdvancedChromaSettings> | undefined,
	newState: PartialDeep<VideoState.USK.UpstreamKeyerAdvancedChromaSettings> | undefined
): void {
	if (!oldState && !newState) return

	{
		const oldProperties = fillDefaults(Defaults.Video.UpstreamKeyerAdvancedChromaProperties, oldState?.properties)
		const newProperties = fillDefaults(Defaults.Video.UpstreamKeyerAdvancedChromaProperties, newState?.properties)

		commands.setUpstreamKeyerAdvancedChromaProperties(
			diffObject(oldProperties, newProperties),
			mixEffectId,
			upstreamKeyerId
		)
	}
	{
		const oldProperties = fillDefaults(Defaults.Video.UpstreamKeyerAdvancedChromaSample, oldState?.sample)
		const newProperties = fillDefaults(Defaults.Video.UpstreamKeyerAdvancedChromaSample, newState?.sample)

		commands.setUpstreamKeyerAdvancedChromaSample(
			diffObject(oldProperties, newProperties),
			mixEffectId,
			upstreamKeyerId
		)
	}
}
