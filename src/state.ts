import { AtemState, VideoState } from 'atem-connection'
import * as Enums from './enums'

export interface AtemVideoState extends Omit<VideoState.AtemVideoState, 'mixEffects'> {
	mixEffects: Array<MixEffect | undefined>
}

export type MixEffect = ExtendedMixEffect

export interface ExtendedMixEffect extends VideoState.MixEffect {
	/** @deprecated - use programInput instead */
	input?: number
	/** falls back to Enums.TransitionStyle.CUT when undefined */
	transition?: Enums.TransitionStyle
}

export interface State extends Omit<AtemState, 'video'> {
	video: AtemVideoState
}
