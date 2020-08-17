import * as CK from '../chromaKeyer'
import { Defaults } from '../../../'
import { Commands, AtemStateUtil } from 'atem-connection'
import { jsonClone } from '../../../util'

const STATE1 = AtemStateUtil.Create()
const ME1 = AtemStateUtil.getMixEffect(STATE1, 0)
const USK1 = AtemStateUtil.getUpstreamKeyer(ME1, 0)

const STATE2 = AtemStateUtil.Create()
const ME2 = AtemStateUtil.getMixEffect(STATE2, 0)
const USK2 = AtemStateUtil.getUpstreamKeyer(ME2, 0)

test('Unit: upstream keyers: chroma keyer undefined gives no error', function () {
	USK1.chromaSettings = jsonClone(Defaults.Video.UpstreamKeyerChromaSettings)

	// same state gives no commands:
	let ck = USK2.chromaSettings
	delete USK2.chromaSettings
	const commands = CK.resolveChromaKeyerState(0, 0, USK1, USK2)
	expect(commands).toHaveLength(0)
	USK2.chromaSettings = ck
})

test('Unit: upstream keyers: chroma keyer', function () {
	USK2.chromaSettings = {
		gain: 1,
		hue: 2,
		lift: 3,
		narrow: true,
		ySuppress: 4
	}
	const commands = CK.resolveChromaKeyerState(0, 0, USK1, USK2) as Array<Commands.MixEffectKeyChromaCommand>

	expect(commands[0].constructor.name).toEqual('MixEffectKeyChromaCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(commands[0].properties).toEqual({
		gain: 1,
		hue: 2,
		lift: 3,
		narrow: true,
		ySuppress: 4
	})

	USK2.chromaSettings = jsonClone(Defaults.Video.UpstreamKeyerChromaSettings)
})
