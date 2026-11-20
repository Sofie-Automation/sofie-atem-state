import { AtemCommandCollector, Enums, VideoState } from 'atem-connection'
import { PartialDeep } from 'type-fest'

import * as Defaults from '../../defaults/index.js'
import { diffObject, fillDefaults, getAllKeysNumber } from '../../util.js'

type FlyFramesState = [
	VideoState.USK.UpstreamKeyerFlyKeyframe | undefined,
	VideoState.USK.UpstreamKeyerFlyKeyframe | undefined,
]

export function resolveFlyKeyerFramesState(
	commands: AtemCommandCollector,
	mixEffectId: number,
	upstreamKeyerId: number,
	oldState: PartialDeep<FlyFramesState>,
	newState: PartialDeep<FlyFramesState>,
	diffOptions: number[] | 'all'
): void {
	for (const index of getAllKeysNumber(oldState, newState)) {
		if (diffOptions === 'all' || diffOptions.includes(index)) {
			const newKeyframe = fillDefaults(Defaults.Video.flyKeyframe(index), newState?.[index])
			const oldKeyframe = fillDefaults(Defaults.Video.flyKeyframe(index), oldState?.[index])

			const { keyFrameId: _keyFrameId, ...props } = diffObject(oldKeyframe, newKeyframe)
			commands.setUpstreamKeyerFlyKeyKeyframe(mixEffectId, upstreamKeyerId, index + 1, props)
		}
	}
}

export function resolveFlyPropertiesState(
	commands: AtemCommandCollector,
	mixEffectId: number,
	upstreamKeyerId: number,
	oldState: Partial<VideoState.USK.UpstreamKeyerFlySettings> | undefined,
	newState: PartialDeep<VideoState.USK.UpstreamKeyerFlySettings> | undefined
): void {
	if (!oldState && !newState) return

	const oldKeyProps = fillDefaults(Defaults.Video.FlyKeyProperties, oldState)
	const newKeyProps = fillDefaults(Defaults.Video.FlyKeyProperties, newState)

	if (oldKeyProps.isAtKeyFrame !== newKeyProps.isAtKeyFrame) {
		const keyframe: Enums.FlyKeyKeyFrame = newKeyProps.isAtKeyFrame as number

		if (keyframe === Enums.FlyKeyKeyFrame.RunToInfinite) {
			commands.runUpstreamKeyerFlyKeyToInfinite(mixEffectId, upstreamKeyerId, newKeyProps.runToInfiniteIndex)
		} else if (keyframe !== Enums.FlyKeyKeyFrame.None) {
			// There is nothing to run to for None
			commands.runUpstreamKeyerFlyKeyTo(mixEffectId, upstreamKeyerId, keyframe)
		}
	}
}
