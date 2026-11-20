import { AtemStateUtil } from 'atem-connection'

import { AtemState } from '../atemState.js'
import { DiffAllObject } from '../diff.js'

test('Unit test: Atem State: Set State', function () {
	const state = new AtemState()

	const newObj = AtemStateUtil.Create()
	;(newObj.video.auxilliaries as number[]) = [0, 0, 1]
	state.setState(newObj)

	expect(state.getState()).toMatchObject({ video: { auxilliaries: [0, 0, 1] } })
})

test('Unit test: Atem State: Diff State', function () {
	const state = new AtemState()

	const newObj = AtemStateUtil.Create()
	;(newObj.video.auxilliaries as number[]) = [0, 0, 1]
	state.setState(newObj)

	const newObj2 = AtemStateUtil.Create()
	;(newObj2.video.auxilliaries as number[]) = [0, 0, 2]
	const commands = state.diffState(newObj2, DiffAllObject())

	expect(commands).toHaveLength(1)
	expect(commands[0].constructor.name).toEqual('AuxSourceCommand')
})
