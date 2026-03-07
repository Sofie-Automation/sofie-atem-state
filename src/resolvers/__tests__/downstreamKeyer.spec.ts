import { resolveDownstreamKeyerState } from '../downstreamKeyer'
import { Commands, VideoState } from 'atem-connection'
import * as Defaults from '../../defaults'
import { jsonClone } from '../../util'
import { DiffDownstreamKeyer, SectionsToDiff } from '../../diff'

function setupDSK(props?: Partial<VideoState.DSK.DownstreamKeyer>): Required<VideoState.DSK.DownstreamKeyer> {
	return jsonClone({
		...Defaults.Video.DownstreamKeyer,
		isTowardsOnAir: false,
		sources: Defaults.Video.DownstreamerKeyerSources,
		properties: {
			...Defaults.Video.DownstreamerKeyerProperties,
			...props,
		},
	})
}

const DSK1 = [setupDSK(), setupDSK()]
const DSK2 = [setupDSK(), setupDSK()]

const fullDiff: SectionsToDiff['video'] & { downstreamKeyers: Required<DiffDownstreamKeyer> } = {
	downstreamKeyers: {
		sources: true,
		onAir: true,
		properties: true,
		mask: true,
	},
}

test('Unit: Downstream keyer: same state gives no commands', function () {
	const { commands } = resolveDownstreamKeyerState(DSK1, DSK1, fullDiff)
	expect(commands).toHaveLength(0)
})

test('Unit: Downstream keyer: auto and onAir commands', function () {
	DSK2[0].onAir = true
	DSK2[1] = {
		...DSK2[1],
		isAuto: true,
	}

	const { commands } = resolveDownstreamKeyerState(DSK1, DSK2, fullDiff)
	expect(commands).toHaveLength(2)

	const firstCommand = commands[0] as Commands.DownstreamKeyOnAirCommand
	expect(firstCommand.constructor.name).toEqual('DownstreamKeyOnAirCommand')
	expect(firstCommand.downstreamKeyerId).toEqual(0)
	expect(firstCommand.properties).toEqual({
		onAir: true,
	})

	const secondCommand = commands[1] as Commands.DownstreamKeyAutoCommand
	expect(secondCommand.constructor.name).toEqual('DownstreamKeyAutoCommand')
	expect(secondCommand.downstreamKeyerId).toEqual(1)

	DSK2[0].onAir = false
	DSK2[1] = {
		...DSK2[1],
		isAuto: false,
	}
})

test('Unit: Downstream keyer: sources', function () {
	DSK2[0].sources.fillSource = 1
	DSK2[1].sources.cutSource = 2

	const { commands } = resolveDownstreamKeyerState(DSK1, DSK2, fullDiff)
	expect(commands).toHaveLength(2)

	const firstCommand = commands[0] as Commands.DownstreamKeyFillSourceCommand
	expect(firstCommand.constructor.name).toEqual('DownstreamKeyFillSourceCommand')
	expect(firstCommand.downstreamKeyerId).toEqual(0)
	expect(firstCommand.properties).toEqual({
		input: 1,
	})

	const secondCommand = commands[1] as Commands.DownstreamKeyCutSourceCommand
	expect(secondCommand.constructor.name).toEqual('DownstreamKeyCutSourceCommand')
	expect(secondCommand.downstreamKeyerId).toEqual(1)
	expect(secondCommand.properties).toEqual({
		input: 2,
	})

	DSK2[0].sources = jsonClone(Defaults.Video.DownstreamerKeyerSources)
	DSK2[1].sources = jsonClone(Defaults.Video.DownstreamerKeyerSources)
})

test('Unit: Downstream keyer: rate', function () {
	DSK2[0].properties.rate = 50
	const { commands } = resolveDownstreamKeyerState(DSK1, DSK2, fullDiff)
	expect(commands).toHaveLength(1)

	const firstCommand = commands[0] as Commands.DownstreamKeyRateCommand
	expect(firstCommand.constructor.name).toEqual('DownstreamKeyRateCommand')
	expect(firstCommand.downstreamKeyerId).toEqual(0)
	expect(firstCommand.properties).toEqual({
		rate: 50,
	})
	DSK2[0].properties.rate = DSK1[0].properties.rate
})

test('Unit: Downstream keyer: tie', function () {
	DSK2[0].properties.tie = true
	const { commands } = resolveDownstreamKeyerState(DSK1, DSK2, fullDiff)
	expect(commands).toHaveLength(1)

	const firstCommand = commands[0] as Commands.DownstreamKeyTieCommand
	expect(firstCommand.constructor.name).toEqual('DownstreamKeyTieCommand')
	expect(firstCommand.downstreamKeyerId).toEqual(0)
	expect(firstCommand.properties).toEqual({
		tie: true,
	})
	DSK2[0].properties.tie = false
})

test('Unit: Downstream keyer: properties', function () {
	DSK2[0].properties.preMultiply = true
	DSK2[0].properties.clip = 500
	DSK2[0].properties.gain = 50
	DSK2[0].properties.invert = true
	const { commands } = resolveDownstreamKeyerState(DSK1, DSK2, fullDiff)
	expect(commands).toHaveLength(1)

	const firstCommand = commands[0] as Commands.DownstreamKeyGeneralCommand
	expect(firstCommand.constructor.name).toEqual('DownstreamKeyGeneralCommand')
	expect(firstCommand.downstreamKeyerId).toEqual(0)
	expect(firstCommand.properties).toEqual({
		preMultiply: true,
		clip: 500,
		gain: 50,
		invert: true,
	})
	DSK2[0].properties.preMultiply = false
	DSK2[0].properties.clip = 0
	DSK2[0].properties.gain = 0
	DSK2[0].properties.invert = false
})

test('Unit: Downstream keyer: mask', function () {
	DSK2[0].properties.mask = {
		enabled: true,
		top: 1,
		bottom: 2,
		left: 3,
		right: 4,
	}
	const { commands } = resolveDownstreamKeyerState(DSK1, DSK2, fullDiff)
	expect(commands).toHaveLength(1)

	const firstCommand = commands[0] as Commands.DownstreamKeyMaskCommand
	expect(firstCommand.constructor.name).toEqual('DownstreamKeyMaskCommand')
	expect(firstCommand.downstreamKeyerId).toEqual(0)
	expect(firstCommand.properties).toEqual({
		enabled: true,
		top: 1,
		bottom: 2,
		left: 3,
		right: 4,
	})
	DSK2[0].properties.mask = {
		enabled: false,
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	}
})

test('Unit: Downstream keyer: onAir with tie returns doTransition', function () {
	DSK2[0].properties.tie = true
	DSK2[0].onAir = true
	const { commands, doTransition } = resolveDownstreamKeyerState(DSK1, DSK2, {
		...fullDiff,
		mixEffects: { programPreview: true },
	})
	expect(doTransition).toBe(true)
	expect(commands.filter((c) => c.constructor.name === 'DownstreamKeyOnAirCommand')).toHaveLength(0)
})
