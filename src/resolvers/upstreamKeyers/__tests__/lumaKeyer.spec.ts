import { AtemStateUtil, Commands } from 'atem-connection'

import { collect } from '../../__tests__/collect.js'
import * as Defaults from '../../../defaults/index.js'
import { jsonClone } from '../../../util.js'
import * as LK from '../lumaKeyer.js'

const STATE1 = AtemStateUtil.Create()
const ME1 = AtemStateUtil.getMixEffect(STATE1, 0)
const USK1 = AtemStateUtil.getUpstreamKeyer(ME1, 0)

const STATE2 = AtemStateUtil.Create()
const ME2 = AtemStateUtil.getMixEffect(STATE2, 0)
const USK2 = AtemStateUtil.getUpstreamKeyer(ME2, 0)

test('Unit: upstream keyers: chroma keyer undefined gives no error', function () {
	USK1.lumaSettings = jsonClone(Defaults.Video.UpstreamKeyerLumaSettings)

	// same state gives no commands:
	const lk = USK2.lumaSettings
	delete USK2.lumaSettings
	const commands = collect((c) => LK.resolveLumaKeyerState(c, 0, 0, USK1.lumaSettings, USK2.lumaSettings))
	expect(commands).toHaveLength(0)
	USK2.lumaSettings = lk
})

test('Unit: upstream keyers: luma keyer', function () {
	USK2.lumaSettings = {
		preMultiplied: true,
		clip: 1,
		gain: 2,
		invert: true,
	}
	const commands = collect((c) =>
		LK.resolveLumaKeyerState(c, 0, 0, USK1.lumaSettings, USK2.lumaSettings)
	) as Array<Commands.MixEffectKeyLumaCommand>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('MixEffectKeyLumaCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(commands[0].properties).toEqual({
		preMultiplied: true,
		clip: 1,
		gain: 2,
		invert: true,
	})

	USK2.lumaSettings = jsonClone(USK1.lumaSettings)
})
