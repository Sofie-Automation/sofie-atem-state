import type { AtemCommandCollector, AudioState } from 'atem-connection'
import type { PartialDeep } from 'type-fest'

import * as Defaults from '../defaults/index.js'
import { DiffClassicAudio } from '../diff.js'
import { diffObject, fillDefaults, getAllKeysNumber } from '../util.js'

export function resolveClassicAudioState(
	commands: AtemCommandCollector,
	oldState: PartialDeep<AudioState.AtemClassicAudioState> | undefined,
	newState: PartialDeep<AudioState.AtemClassicAudioState> | undefined,
	diffOptions: DiffClassicAudio
): void {
	if (oldState || newState) {
		resolveClassicAudioMixerOutputsState(commands, oldState, newState, diffOptions)

		if (diffOptions.channels) {
			resolveClassicAudioMixerInputsState(commands, oldState?.channels, newState?.channels, diffOptions.channels)
		}

		if (diffOptions.crossfade) {
			const oldAfv = oldState?.audioFollowVideoCrossfadeTransitionEnabled ?? false
			const newAfv = newState?.audioFollowVideoCrossfadeTransitionEnabled ?? false
			if (oldAfv !== newAfv) {
				commands.setClassicAudioMixerProps({ audioFollowVideo: newAfv })
			}
		}
	}
}

export function resolveClassicAudioMixerOutputsState(
	commands: AtemCommandCollector,
	oldState: PartialDeep<AudioState.AtemClassicAudioState> | undefined,
	newState: PartialDeep<AudioState.AtemClassicAudioState> | undefined,
	diffOptions: DiffClassicAudio
): void {
	if (diffOptions.masterOutput) {
		const oldMaster = fillDefaults(Defaults.ClassicAudio.Master, oldState?.master)
		const newMaster = fillDefaults(Defaults.ClassicAudio.Master, newState?.master)

		commands.setClassicAudioMixerMasterProps(diffObject<AudioState.ClassicAudioMasterChannel>(oldMaster, newMaster))
	}

	if (diffOptions.monitorOutput) {
		const oldMonitor = fillDefaults(Defaults.ClassicAudio.Monitor, oldState?.monitor)
		const newMonitor = fillDefaults(Defaults.ClassicAudio.Monitor, newState?.monitor)

		commands.setClassicAudioMixerMonitorProps(
			diffObject<AudioState.ClassicAudioMonitorChannel>(oldMonitor, newMonitor)
		)
	}

	if (diffOptions.headphonesOutput) {
		const oldHeadphones = fillDefaults(Defaults.ClassicAudio.Headphones, oldState?.headphones)
		const newHeadphones = fillDefaults(Defaults.ClassicAudio.Headphones, newState?.headphones)

		commands.setClassicAudioMixerHeadphonesProps(
			diffObject<AudioState.ClassicAudioHeadphoneOutputChannel>(oldHeadphones, newHeadphones)
		)
	}
}

export function resolveClassicAudioMixerInputsState(
	commands: AtemCommandCollector,
	oldState: PartialDeep<AudioState.AtemClassicAudioState['channels']> | undefined,
	newState: PartialDeep<AudioState.AtemClassicAudioState['channels']> | undefined,
	diffOptions: number[] | 'all'
): void {
	for (const index of getAllKeysNumber(oldState, newState)) {
		if (diffOptions === 'all' || diffOptions.includes(index)) {
			const oldChannel = fillDefaults(Defaults.ClassicAudio.Channel, oldState?.[index])
			const newChannel = fillDefaults(Defaults.ClassicAudio.Channel, newState?.[index])

			commands.setClassicAudioMixerInputProps(
				index,
				diffObject<AudioState.ClassicAudioChannel>(oldChannel, newChannel)
			)
		}
	}
}
