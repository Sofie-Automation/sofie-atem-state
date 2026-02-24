/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as ME from '../mixEffect'
import * as Enums from '../../enums'
import { MixEffect } from '../../state'
import * as Defaults from '../../defaults'
import { Commands, Enums as AtemEnums, AtemStateUtil } from 'atem-connection'
import { jsonClone } from '../../util'
import { DiffAllObject, DiffMixEffect } from '../../diff'

const fullDiffObject = DiffAllObject().video?.mixEffects as DiffMixEffect

function getState() {
	const state1 = AtemStateUtil.Create()
	const mixEffect1: MixEffect = AtemStateUtil.getMixEffect(state1, 0) as unknown as MixEffect
	const state2 = AtemStateUtil.Create()
	const mixEffect2: MixEffect = AtemStateUtil.getMixEffect(state2, 0) as unknown as MixEffect

	return [mixEffect1, mixEffect2]
}

test('Unit: mix effect: same state gives no commands', function () {
	const [ME1, ME2] = getState()

	// same state gives no commands:
	const commands = ME.resolveMixEffectsState([ME1], [ME2], fullDiffObject)
	expect(commands).toHaveLength(0)
})

test('Unit: mix effect: same input gives no commands', function () {
	const [ME1, ME2] = getState()

	ME1.programInput = 1
	ME1.transition = Enums.TransitionStyle.CUT
	ME2.programInput = 1
	ME2.transition = Enums.TransitionStyle.CUT

	const commands = ME.resolveMixEffectsState([ME1], [ME2], fullDiffObject)
	expect(commands).toHaveLength(0)
})

test('Unit: mix effect: hot cut program', function () {
	const [ME1, ME2] = getState()

	ME2.programInput = 1
	ME2.transition = Enums.TransitionStyle.CUT
	const commands = ME.resolveMixEffectsState([ME1], [ME2], fullDiffObject) as Array<Commands.ProgramInputCommand>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('ProgramInputCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].properties).toEqual({
		source: 1,
	})
})

test('Unit: mix effect: preview input', function () {
	const [ME1, ME2] = getState()

	ME2.previewInput = 1
	const commands = ME.resolveMixEffectsState([ME1], [ME2], fullDiffObject) as Array<Commands.PreviewInputCommand>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('PreviewInputCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].properties).toEqual({
		source: 1,
	})
})

test('Unit: mix effect: program + preview', function () {
	const [ME1, ME2] = getState()

	ME2.previewInput = 2
	ME2.programInput = 1
	ME2.transition = Enums.TransitionStyle.CUT
	const commands = ME.resolveMixEffectsState([ME1], [ME2], fullDiffObject) as Array<Commands.PreviewInputCommand>
	expect(commands).toHaveLength(2)

	expect(commands[0].constructor.name).toEqual('ProgramInputCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].properties).toEqual({
		source: 1,
	})
	expect(commands[1].constructor.name).toEqual('PreviewInputCommand')
	expect(commands[1].mixEffect).toEqual(0)
	expect(commands[1].properties).toEqual({
		source: 2,
	})
})

test('Unit: mix effect: deprecated "input" field', function () {
	const [ME1, ME2] = getState()

	ME2.previewInput = 2
	ME2.input = 1 // this is deprecated and should follow the same logic as using programInput
	ME2.transition = Enums.TransitionStyle.CUT
	const commands = ME.resolveMixEffectsState([ME1], [ME2], fullDiffObject) as Array<Commands.PreviewInputCommand>
	expect(commands).toHaveLength(2)

	expect(commands[0].constructor.name).toEqual('ProgramInputCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].properties).toEqual({
		source: 1,
	})
	expect(commands[1].constructor.name).toEqual('PreviewInputCommand')
	expect(commands[1].mixEffect).toEqual(0)
	expect(commands[1].properties).toEqual({
		source: 2,
	})
})

test('Unit: mix effect: dummy command', function () {
	const [ME1, ME2] = getState()

	ME2.programInput = 1
	ME2.transition = Enums.TransitionStyle.DUMMY
	const commands = ME.resolveMixEffectsState([ME1], [ME2], fullDiffObject) as Array<Commands.PreviewInputCommand>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('PreviewInputCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].properties).toEqual({
		source: 1,
	})

	// Dummy implies that something else will perform the cut. (eg a macro)
})

test('Unit: mix effect: auto command', function () {
	const [ME1, ME2] = getState()

	ME2.programInput = 1
	ME2.transition = Enums.TransitionStyle.MIX
	const commands = ME.resolveMixEffectsState([ME1], [ME2], fullDiffObject) as Array<
		Commands.PreviewInputCommand | Commands.TransitionPositionCommand
	>
	expect(commands).toHaveLength(3)

	expect(commands[0].constructor.name).toEqual('PreviewInputCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].properties).toEqual({
		source: 1,
	})

	expect(commands[1].constructor.name).toEqual('TransitionPositionCommand')
	expect(commands[1].mixEffect).toEqual(0)
	expect(commands[1].properties).toEqual({
		handlePosition: 0,
	})

	expect(commands[2].constructor.name).toEqual('AutoTransitionCommand')
	expect(commands[2].mixEffect).toEqual(0)
})

test('Unit: mix effect: auto command, new transition', function () {
	const [ME1, ME2] = getState()

	ME2.programInput = 1
	ME2.transition = Enums.TransitionStyle.WIPE
	const commands = ME.resolveMixEffectsState([ME1], [ME2], fullDiffObject) as Array<
		Commands.PreviewInputCommand | Commands.TransitionPositionCommand
	>
	expect(commands).toHaveLength(4)

	expect(commands[0].constructor.name).toEqual('PreviewInputCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].properties).toEqual({
		source: 1,
	})

	expect(commands[1].constructor.name).toEqual('TransitionPropertiesCommand')
	expect(commands[1].mixEffect).toEqual(0)
	expect(commands[1].properties).toEqual({
		nextStyle: Enums.TransitionStyle.WIPE,
	})

	expect(commands[2].constructor.name).toEqual('TransitionPositionCommand')
	expect(commands[2].mixEffect).toEqual(0)
	expect(commands[2].properties).toEqual({
		handlePosition: 0,
	})

	expect(commands[3].constructor.name).toEqual('AutoTransitionCommand')
	expect(commands[3].mixEffect).toEqual(0)
})

test('Unit: mix effect: transition preview', function () {
	const [ME1, ME2] = getState()

	ME2.transitionPreview = true
	const commands = ME.resolveMixEffectsState([ME1], [ME2], fullDiffObject) as Array<Commands.PreviewTransitionCommand>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('PreviewTransitionCommand')
	expect(commands[0].mixEffect).toEqual(0)
})

test('Unit: mix effect: transition position', function () {
	const [ME1, ME2] = getState()

	ME2.transitionPosition = {
		...ME2.transitionPosition,
		inTransition: true,
		handlePosition: 500,
	}
	const commands = ME.resolveMixEffectsState([ME1], [ME2], fullDiffObject) as Array<Commands.TransitionPositionCommand>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('TransitionPositionCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].properties).toEqual({
		handlePosition: 500,
	})
})

test('Unit: mix effect: from transition, to no transition', function () {
	const [ME1, ME2] = getState()

	ME1.transitionPosition = {
		...ME1.transitionPosition,
		inTransition: true,
		handlePosition: 500,
	}
	const commands = ME.resolveMixEffectsState([ME1], [ME2], fullDiffObject) as Array<Commands.TransitionPositionCommand>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('TransitionPositionCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].properties).toEqual({
		handlePosition: 10000,
	})
})

test('Unit: mix effect: transition properties', function () {
	const [ME1, ME2] = getState()

	ME2.transitionProperties.nextSelection = [
		AtemEnums.TransitionSelection.Background,
		AtemEnums.TransitionSelection.Key1,
	]
	ME2.transitionProperties.nextStyle = 1
	const commands = ME.resolveTransitionPropertiesState(
		0,
		ME1.transitionProperties,
		ME2.transitionProperties
	) as Array<Commands.TransitionPropertiesCommand>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('TransitionPropertiesCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].properties).toEqual({
		nextSelection: [AtemEnums.TransitionSelection.Background, AtemEnums.TransitionSelection.Key1],
		nextStyle: 1,
	})
})

test('Unit: mix effect: transition settings: dip', function () {
	const [ME1, ME2] = getState()

	ME2.transitionSettings.dip = {
		input: 1,
		rate: 50,
	}
	const commands = ME.resolveTransitionSettingsState(
		0,
		ME1.transitionSettings,
		ME2.transitionSettings,
		fullDiffObject.transitionSettings!
	) as Array<Commands.TransitionDipCommand>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('TransitionDipCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].properties).toEqual({
		input: 1,
		rate: 50,
	})
})

test('Unit: mix effect: transition settings: DVE', function () {
	const [ME1, ME2] = getState()

	ME2.transitionSettings.DVE = {
		rate: 50,
		logoRate: 50,
		style: AtemEnums.DVEEffect.PushBottom,
		fillSource: 2,
		keySource: 4,

		enableKey: true,
		preMultiplied: true,
		clip: 1,
		gain: 1,
		invertKey: true,
		reverse: true,
		flipFlop: true,
	}
	const commands = ME.resolveTransitionSettingsState(
		0,
		ME1.transitionSettings,
		ME2.transitionSettings,
		fullDiffObject.transitionSettings!
	) as Array<Commands.TransitionDVECommand>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('TransitionDVECommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].flag).toEqual(4095)
	expect(commands[0].properties).toEqual({
		rate: 50,
		logoRate: 50,
		style: AtemEnums.DVEEffect.PushBottom,
		fillSource: 2,
		keySource: 4,

		enableKey: true,
		preMultiplied: true,
		clip: 1,
		gain: 1,
		invertKey: true,
		reverse: true,
		flipFlop: true,
	})
})

test('Unit: mix effect: transition settings: mix', function () {
	const [ME1, ME2] = getState()

	ME2.transitionSettings.mix = jsonClone(Defaults.Video.MixTransitionSettings)
	ME2.transitionSettings.mix.rate = 50
	const commands = ME.resolveTransitionSettingsState(
		0,
		ME1.transitionSettings,
		ME2.transitionSettings,
		fullDiffObject.transitionSettings!
	) as Array<Commands.TransitionMixCommand>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('TransitionMixCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].properties).toEqual({
		rate: 50,
	})
})

test('Unit: mix effect: transition settings: stinger', function () {
	const [ME1, ME2] = getState()

	ME2.transitionSettings.stinger = {
		source: 1,
		preMultipliedKey: true,

		clip: 1,
		gain: 1, // 0...1000
		invert: true,

		preroll: 10,
		clipDuration: 50,
		triggerPoint: 25,
		mixRate: 25,
	}
	const commands = ME.resolveTransitionSettingsState(
		0,
		ME1.transitionSettings,
		ME2.transitionSettings,
		fullDiffObject.transitionSettings!
	) as Array<Commands.TransitionStingerCommand>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('TransitionStingerCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].properties).toEqual({
		source: 1,
		preMultipliedKey: true,

		clip: 1,
		gain: 1, // 0...1000
		invert: true,

		preroll: 10,
		clipDuration: 50,
		triggerPoint: 25,
		mixRate: 25,
	})
})

test('Unit: mix effect: transition settings: wipe', function () {
	const [ME1, ME2] = getState()

	ME2.transitionSettings.wipe = {
		rate: 50,
		pattern: AtemEnums.Pattern.HorizontalBarnDoor,
		borderWidth: 1,
		borderInput: 1,
		symmetry: 1,
		borderSoftness: 1,
		xPosition: 1,
		yPosition: 1,
		reverseDirection: true,
		flipFlop: true,
	}
	const commands = ME.resolveTransitionSettingsState(
		0,
		ME1.transitionSettings,
		ME2.transitionSettings,
		fullDiffObject.transitionSettings!
	) as Array<Commands.TransitionWipeCommand>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('TransitionWipeCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].properties).toEqual({
		rate: 50,
		pattern: AtemEnums.Pattern.HorizontalBarnDoor,
		borderWidth: 1,
		borderInput: 1,
		symmetry: 1,
		borderSoftness: 1,
		xPosition: 1,
		yPosition: 1,
		reverseDirection: true,
		flipFlop: true,
	})
})
