import { collect } from './collect'
import { Commands, Macro } from 'atem-connection'
import { DiffMacroPlayer } from '../../diff'
import { resolveMacroPlayerState } from '../macro'

const STATE1: Macro.MacroPlayerState = {
	isRunning: true,
	isWaiting: false,
	loop: true,
	macroIndex: 12,
}

const STATE2: Macro.MacroPlayerState = {
	isRunning: true,
	isWaiting: false,
	loop: true,
	macroIndex: 10,
}

const STATE3: Macro.MacroPlayerState = {
	isRunning: false,
	isWaiting: false,
	loop: true,
	macroIndex: 12,
}

const fullDiff: Required<DiffMacroPlayer> = {
	player: true,
}

test('Unit: macro: same state gives no commands', function () {
	// same state gives no commands:
	const commands = collect((c) => resolveMacroPlayerState(c, STATE1, STATE1, fullDiff))
	expect(commands).toHaveLength(0)
})

test('Unit: macro: change running macro', function () {
	const commands = collect((c) =>
		resolveMacroPlayerState(c, STATE1, STATE2, fullDiff)
	) as Array<Commands.MacroActionCommand>

	expect(commands).toHaveLength(1)
	expect(commands[0].constructor.name).toEqual('MacroActionCommand')
	expect(commands[0].index).toEqual(10)
	expect(commands[0].properties).toEqual({
		action: 0,
	})
})

test('Unit: macro: stop macro', function () {
	const commands = collect((c) =>
		resolveMacroPlayerState(c, STATE2, STATE3, fullDiff)
	) as Array<Commands.MacroActionCommand>

	// This will change once this is supported properly, but for now it should not start playing
	expect(commands).toHaveLength(0)
})
