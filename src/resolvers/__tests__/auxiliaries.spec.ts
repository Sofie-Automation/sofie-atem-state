import { collect } from './collect'
import { Commands } from 'atem-connection'
import { resolveAuxiliaries } from '../auxiliaries'

const STATE1: number[] = [0, 0, 0, 2]
const STATE2: number[] = [1, 0, 2, 0]

test('Unit: auxiliaries: same state gives no commands', function () {
	// same state gives no commands:
	const commands = collect((c) => resolveAuxiliaries(c, STATE1, STATE1, 'all')) as Commands.AuxSourceCommand[]
	expect(commands).toHaveLength(0)

	// same state gives no commands:
	const commands1 = collect((c) => resolveAuxiliaries(c, STATE1, STATE1, [])) as Commands.AuxSourceCommand[]
	expect(commands1).toHaveLength(0)
})

test('Unit: auxiliaries: update some inputs', function () {
	const commands = collect((c) => resolveAuxiliaries(c, STATE1, STATE2, 'all')) as Commands.AuxSourceCommand[]
	expect(commands).toHaveLength(3)

	expect(commands[0].constructor.name).toEqual('AuxSourceCommand')
	expect(commands[0].auxBus).toEqual(0)
	expect(commands[0].properties).toEqual({
		source: 1,
	})

	expect(commands[1].constructor.name).toEqual('AuxSourceCommand')
	expect(commands[1].auxBus).toEqual(2)
	expect(commands[1].properties).toEqual({
		source: 2,
	})

	expect(commands[2].constructor.name).toEqual('AuxSourceCommand')
	expect(commands[2].auxBus).toEqual(3)
	expect(commands[2].properties).toEqual({
		source: 0,
	})
})

test('Unit: auxiliaries: limit inputs', function () {
	const commands = collect((c) => resolveAuxiliaries(c, STATE1, STATE2, [0, 2, 5])) as Commands.AuxSourceCommand[]
	expect(commands).toHaveLength(2)

	expect(commands[0].constructor.name).toEqual('AuxSourceCommand')
	expect(commands[0].auxBus).toEqual(0)
	expect(commands[0].properties).toEqual({
		source: 1,
	})

	expect(commands[1].constructor.name).toEqual('AuxSourceCommand')
	expect(commands[1].auxBus).toEqual(2)
	expect(commands[1].properties).toEqual({
		source: 2,
	})
})
