import { collect } from '../../__tests__/collect'
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as DVE from '../dveKeyer'
import * as Defaults from '../../../defaults'
import { Commands, Enums, AtemStateUtil } from 'atem-connection'
import { jsonClone } from '../../../util'

const STATE1 = AtemStateUtil.Create()
const ME1 = AtemStateUtil.getMixEffect(STATE1, 0)
const USK1 = AtemStateUtil.getUpstreamKeyer(ME1, 0)

const STATE2 = AtemStateUtil.Create()
const ME2 = AtemStateUtil.getMixEffect(STATE2, 0)
const USK2 = AtemStateUtil.getUpstreamKeyer(ME2, 0)

test('Unit: upstream keyers: chroma keyer undefined gives no error', function () {
	USK1.dveSettings = jsonClone(Defaults.Video.UpstreamKeyerDVESettings)

	// same state gives no commands:
	delete USK2.dveSettings
	const commands = collect((c) => DVE.resolveDVEKeyerState(c, 0, 0, USK1.dveSettings, USK2.dveSettings))
	expect(commands).toHaveLength(0)
	USK2.dveSettings = jsonClone(Defaults.Video.UpstreamKeyerDVESettings)
})

test('Unit: upstream keyers: dve keyer: general props', function () {
	USK2.dveSettings = {
		...USK2.dveSettings!,
		rate: 2,
		sizeX: 3,
		sizeY: 4,
		positionX: 5,
		positionY: 6,
		rotation: 7,
		lightSourceDirection: 8,
		lightSourceAltitude: 9,
	}
	const commands = collect((c) =>
		DVE.resolveDVEKeyerState(c, 0, 0, USK1.dveSettings, USK2.dveSettings)
	) as Commands.MixEffectKeyDVECommand[]

	expect(commands[0].constructor.name).toEqual('MixEffectKeyDVECommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(commands[0].properties).toEqual({
		rate: 2,
		sizeX: 3,
		sizeY: 4,
		positionX: 5,
		positionY: 6,
		rotation: 7,
		lightSourceDirection: 8,
		lightSourceAltitude: 9,
	})

	USK2.dveSettings = jsonClone(Defaults.Video.UpstreamKeyerDVESettings)
})

test('Unit: upstream keyers: dve keyer: border', function () {
	USK2.dveSettings!.borderEnabled = true
	USK2.dveSettings!.borderBevel = Enums.BorderBevel.InOut
	USK2.dveSettings!.borderOuterWidth = 1
	USK2.dveSettings!.borderInnerWidth = 2
	USK2.dveSettings!.borderOuterSoftness = 3
	USK2.dveSettings!.borderInnerSoftness = 4
	USK2.dveSettings!.borderBevelSoftness = 5
	USK2.dveSettings!.borderBevelPosition = 6
	USK2.dveSettings!.borderOpacity = 7
	USK2.dveSettings!.borderHue = 8
	USK2.dveSettings!.borderSaturation = 9
	USK2.dveSettings!.borderLuma = 10
	const commands = collect((c) =>
		DVE.resolveDVEKeyerState(c, 0, 0, USK1.dveSettings, USK2.dveSettings)
	) as Commands.MixEffectKeyDVECommand[]

	expect(commands[0].constructor.name).toEqual('MixEffectKeyDVECommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(commands[0].properties).toEqual({
		borderEnabled: true,
		borderBevel: Enums.BorderBevel.InOut,
		borderOuterWidth: 1,
		borderInnerWidth: 2,
		borderOuterSoftness: 3,
		borderInnerSoftness: 4,
		borderBevelSoftness: 5,
		borderBevelPosition: 6,
		borderOpacity: 7,
		borderHue: 8,
		borderSaturation: 9,
		borderLuma: 10,
	})

	USK2.dveSettings = jsonClone(Defaults.Video.UpstreamKeyerDVESettings)
})

test('Unit: upstream keyers: dve keyer: mask props', function () {
	USK2.dveSettings = {
		...USK2.dveSettings!,

		maskEnabled: true,
		maskTop: 1,
		maskBottom: 2,
		maskLeft: 3,
		maskRight: 4,
	}
	const commands = collect((c) =>
		DVE.resolveDVEKeyerState(c, 0, 0, USK1.dveSettings, USK2.dveSettings)
	) as Commands.MixEffectKeyDVECommand[]

	expect(commands[0].constructor.name).toEqual('MixEffectKeyDVECommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(commands[0].properties).toEqual({
		maskEnabled: true,
		maskTop: 1,
		maskBottom: 2,
		maskLeft: 3,
		maskRight: 4,
	})

	USK2.dveSettings = jsonClone(Defaults.Video.UpstreamKeyerDVESettings)
})
