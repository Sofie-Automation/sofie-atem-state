/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as USK from '../index'
import * as Defaults from '../../../defaults'
import { Commands, Enums, AtemStateUtil } from 'atem-connection'
import { DiffAllObject, DiffMixEffect } from '../../../diff'

const STATE1 = AtemStateUtil.Create()
const ME1 = AtemStateUtil.getMixEffect(STATE1, 0)
const USK1 = AtemStateUtil.getUpstreamKeyer(ME1, 0)

const STATE2 = AtemStateUtil.Create()
const ME2 = AtemStateUtil.getMixEffect(STATE2, 0)
const USK2 = AtemStateUtil.getUpstreamKeyer(ME2, 0)

const fullDiffOptions = (DiffAllObject().video?.mixEffects as DiffMixEffect).upstreamKeyers!

test('Unit: upstream keyers: same state gives no commands', function () {
	// same state gives no commands:
	const { commands } = USK.resolveUpstreamKeyerState(
		0,
		ME1.upstreamKeyers,
		ME2.upstreamKeyers,
		undefined,
		fullDiffOptions
	)
	expect(commands).toHaveLength(0)
})

test('Unit: upstream keyers: undefined gives no error', function () {
	// same state gives no commands:
	const usk = ME2.upstreamKeyers[0]
	delete ME2.upstreamKeyers[0]
	const { commands } = USK.resolveUpstreamKeyerState(
		0,
		ME1.upstreamKeyers,
		ME2.upstreamKeyers,
		undefined,
		fullDiffOptions
	)
	expect(commands).toHaveLength(0)
	ME2.upstreamKeyers[0] = usk
})

test('Unit: upstream keyers: sources', function () {
	USK2.cutSource = 1
	USK2.fillSource = 2
	const commands = USK.resolveUpstreamKeyerState(0, ME1.upstreamKeyers, ME2.upstreamKeyers, undefined, fullDiffOptions)
		.commands as [Commands.MixEffectKeyFillSourceSetCommand, Commands.DownstreamKeyCutSourceCommand]
	expect(commands).toHaveLength(2)

	expect(commands[0].constructor.name).toEqual('MixEffectKeyFillSourceSetCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(commands[0].properties).toEqual({
		fillSource: 2,
	})

	expect(commands[1].constructor.name).toEqual('MixEffectKeyCutSourceSetCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(Object.keys(commands[0].properties).length).toBe(1)
	expect(commands[1].properties).toEqual({
		cutSource: 1,
	})

	USK2.cutSource = Defaults.Video.defaultInput
	USK2.fillSource = Defaults.Video.defaultInput
})

test('Unit: upstream keyers: key type', function () {
	USK2.mixEffectKeyType = Enums.MixEffectKeyType.Pattern
	const commands = USK.resolveUpstreamKeyerState(0, ME1.upstreamKeyers, ME2.upstreamKeyers, undefined, fullDiffOptions)
		.commands as [Commands.MixEffectKeyTypeSetCommand]
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('MixEffectKeyTypeSetCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(commands[0].properties).toEqual({
		mixEffectKeyType: 2,
	})

	USK2.mixEffectKeyType = USK1.mixEffectKeyType
})

test('Unit: upstream keyers: flyKey enabled', function () {
	USK2.flyEnabled = !USK1.flyEnabled
	const commands = USK.resolveUpstreamKeyerState(0, ME1.upstreamKeyers, ME2.upstreamKeyers, undefined, fullDiffOptions)
		.commands as [Commands.MixEffectKeyTypeSetCommand]
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('MixEffectKeyTypeSetCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(commands[0].properties).toEqual({
		flyEnabled: !USK1.flyEnabled,
	})

	USK2.flyEnabled = USK1.flyEnabled
})

test('Unit: upstream keyers: keyer on air', function () {
	USK2.onAir = !USK1.onAir
	const commands = USK.resolveUpstreamKeyerState(0, ME1.upstreamKeyers, ME2.upstreamKeyers, undefined, fullDiffOptions)
		.commands as [Commands.MixEffectKeyOnAirCommand]
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('MixEffectKeyOnAirCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(Object.keys(commands[0].properties).length).toBe(1)
	expect(commands[0].properties).toEqual({
		onAir: !USK1.onAir,
	})

	USK2.onAir = USK1.onAir
})

// eslint-disable-next-line jest/no-commented-out-tests
// test('Unit: upstream keyer: mask', function () {
// 	USK2.maskEnabled = true
// 	const commands = USK.resolveUpstreamKeyerState(0, ME1.upstreamKeyers, ME2.upstreamKeyers, fullDiffOptions) as [Commands.MixEffectKeyMaskSetCommand]
// 	expect(commands).toHaveLength(1)

// 	expect(commands[0].constructor.name).toEqual('MixEffectKeyMaskSetCommand')
// 	expect(commands[0].mixEffect).toEqual(0)
// 	expect(commands[0].upstreamKeyerId).toEqual(0)
// 	expect(Object.keys(commands[0].properties).length).toBe(1)
// 	expect(commands[0].properties).toEqual({
// 		maskEnabled: true
// 	})

// 	USK2.maskEnabled = false
// })

// eslint-disable-next-line jest/no-commented-out-tests
// test('Unit: upstream keyer: mask position', function () {
// 	USK2.maskBottom = 1
// 	USK2.maskTop = 2
// 	USK2.maskLeft = 3
// 	USK2.maskRight = 4
// 	const commands = USK.resolveUpstreamKeyerState(0, ME1.upstreamKeyers, ME2.upstreamKeyers, fullDiffOptions) as [Commands.MixEffectKeyMaskSetCommand]
// 	expect(commands).toHaveLength(1)

// 	expect(commands[0].constructor.name).toEqual('MixEffectKeyMaskSetCommand')
// 	expect(commands[0].mixEffect).toEqual(0)
// 	expect(commands[0].upstreamKeyerId).toEqual(0)
// 	expect(Object.keys(commands[0].properties).length).toBe(4)
// 	expect(commands[0].properties).toEqual({
// 		maskBottom: 1,
// 	  	maskTop: 2,
// 		maskLeft: 3,
// 		maskRight: 4
// 	})

// 	USK2.maskBottom = 0
// 	USK2.maskTop = 0
// 	USK2.maskLeft = 0
// 	USK2.maskRight = 0
// })
