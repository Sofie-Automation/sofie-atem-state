import { AudioState, Commands } from 'atem-connection'
import { expect, test } from 'vitest'

import { DiffAllObject } from '../../diff.js'
import { jsonClone } from '../../util.js'
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { resolveClassicAudioState } from '../classic-audio.js'
import { collect } from './collect.js'

function literal<T>(o: T) {
	return o
}

function omit<T, K extends keyof T>(o: T, ...keys: K[]): Omit<T, K> {
	const obj: any = { ...o }
	for (const key of keys) {
		delete obj[key]
	}
	return obj
}

const STATE1 = literal<AudioState.AtemClassicAudioState>({
	channels: [
		literal<AudioState.AudioChannel>({
			sourceType: 0,
			portType: 1,
			mixOption: 0,
			gain: 0,
			balance: 0,
			supportsRcaToXlrEnabled: false,
			rcaToXlrEnabled: false,
		}),
		literal<AudioState.AudioChannel>({
			sourceType: 0,
			portType: 1,
			mixOption: 1,
			gain: 5,
			balance: 4,
			supportsRcaToXlrEnabled: false,
			rcaToXlrEnabled: false,
		}),
	],
	hasMonitor: true,
	numberOfChannels: 2,
})
const STATE2 = jsonClone(STATE1)
STATE2.master = {
	gain: 0,
	balance: 0,
	followFadeToBlack: false,
}

const diffObject = DiffAllObject().audio!.classic!

test('Unit: audio: same state gives no commands', function () {
	// same state gives no commands:
	const commands = collect((c) => resolveClassicAudioState(c, STATE1, STATE1, diffObject))
	expect(commands).toHaveLength(0)
})

test('Unit: audio: channel command', function () {
	STATE2.channels[0]!.gain = -192

	const commands = collect((c) =>
		resolveClassicAudioState(c, STATE1, STATE2, diffObject)
	) as Array<Commands.AudioMixerInputCommand>
	expect(commands).toHaveLength(1)
	expect(commands[0].constructor.name).toEqual('AudioMixerInputCommand')
	expect(commands[0].index).toEqual(0)
	expect(commands[0].properties).toEqual({ gain: -192 })
	expect(commands[0].flag).toEqual(2) // 010

	STATE2.channels[0]!.gain = 0
})

test('Unit: audio: new channel', function () {
	const c = STATE1.channels[1]!
	delete STATE1.channels[1]

	const commands = collect((c) =>
		resolveClassicAudioState(c, STATE1, STATE2, diffObject)
	) as Array<Commands.AudioMixerInputCommand>
	expect(commands).toHaveLength(1)
	expect(commands[0].constructor.name).toEqual('AudioMixerInputCommand')
	expect(commands[0].index).toEqual(1)
	expect(commands[0].properties).toEqual(
		omit(STATE2.channels[1]!, 'portType', 'sourceType', 'supportsRcaToXlrEnabled', 'rcaToXlrEnabled')
	) // at what point should it include rcaToXlrEnabled?
	expect(commands[0].flag).toEqual(7) // 111

	STATE1.channels[1] = c
})

test('Unit: audio: master channel', function () {
	STATE2.master!.gain = -10

	const commands = collect((c) =>
		resolveClassicAudioState(c, STATE1, STATE2, diffObject)
	) as Array<Commands.AudioMixerInputCommand>
	expect(commands).toHaveLength(1)
	expect(commands[0].constructor.name).toEqual('AudioMixerMasterCommand')
	expect(commands[0].properties).toEqual({
		gain: STATE2.master!.gain,
	})
	expect(commands[0].flag).toEqual(1) // 001

	STATE2.master!.gain = 0
})
