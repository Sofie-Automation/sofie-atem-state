import { Enums as ConnEnums } from 'atem-connection'

import * as Enums from '../enums.js'

function getNumberValues(obj: any): number[] {
	const isNumber = (v: any): v is number => typeof v === 'number'
	return Object.values<any>(obj).filter(isNumber)
}

test('Unit test: Enums: TransitionStyle identical values', function () {
	const enumVals = getNumberValues(Enums.TransitionStyle)
	const connVals = getNumberValues(ConnEnums.TransitionStyle)

	const extendedConnVals = [...connVals, Enums.TransitionStyle.CUT, Enums.TransitionStyle.DUMMY]

	expect(extendedConnVals).toEqual(enumVals)
})
