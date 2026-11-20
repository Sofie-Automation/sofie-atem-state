import { Commands, Enums, VideoState } from 'atem-connection'

import * as Defaults from '../../defaults/index.js'
import { DiffSuperSource } from '../../diff.js'
import { jsonClone } from '../../util.js'
import {
	resolveSuperSourceBorderV8State,
	resolveSuperSourcePropertiesState,
	resolveSuperSourcePropertiesV8State,
	resolveSuperSourceState,
} from '../supersource.js'
import { collect } from './collect.js'

const SSRC1: Required<VideoState.SuperSource.SuperSource> = jsonClone({
	index: 0,
	boxes: [
		Defaults.Video.SuperSourceBox,
		Defaults.Video.SuperSourceBox,
		Defaults.Video.SuperSourceBox,
		Defaults.Video.SuperSourceBox,
	],
	properties: Defaults.Video.SuperSourceProperties,
	border: Defaults.Video.SuperSourceBorder,
})

const SSRC2: Required<VideoState.SuperSource.SuperSource> = jsonClone({
	index: 0,
	boxes: [
		{
			enabled: true,
			source: 1,
			x: 1,
			y: 1,
			size: 1,
			cropped: true,
			cropTop: 1,
			cropBottom: 1,
			cropLeft: 1,
			cropRight: 1,
		},
		Defaults.Video.SuperSourceBox,
		Defaults.Video.SuperSourceBox,
		Defaults.Video.SuperSourceBox,
	],
	properties: Defaults.Video.SuperSourceProperties,
	border: Defaults.Video.SuperSourceBorder,
})

const fullDiff: Required<DiffSuperSource> = {
	boxes: 'all',
	border: true,
	properties: true,
}

test('Unit: super source boxes: same state gives no commands', function () {
	// same state gives no commands:
	const commands = collect((c) => resolveSuperSourceState(c, [SSRC1], [SSRC1], fullDiff), Enums.ProtocolVersion.V7_2)
	expect(commands).toHaveLength(0)
})

test('Unit: super source boxes: status command', function () {
	const commands = collect(
		(c) => resolveSuperSourceState(c, [SSRC1], [SSRC2], fullDiff),
		Enums.ProtocolVersion.V7_2
	) as Array<Commands.SuperSourceBoxParametersCommand>

	expect(commands[0].constructor.name).toEqual('SuperSourceBoxParametersCommand')
	expect(commands[0].boxId).toEqual(0)
	expect(commands[0].flag).toEqual(1023)
	expect(commands[0].properties).toEqual({
		enabled: true,
		source: 1,
		x: 1,
		y: 1,
		size: 1,
		cropped: true,
		cropTop: 1,
		cropBottom: 1,
		cropLeft: 1,
		cropRight: 1,
	})
})

test('Unit: super source boxes: box removed', function () {
	const ssBox = SSRC2.boxes[0]
	// eslint-disable-next-line @typescript-eslint/no-array-delete -- testing a missing box
	delete SSRC2.boxes[0]
	const commands = collect(
		(c) => resolveSuperSourceState(c, [SSRC1], [SSRC2], fullDiff),
		Enums.ProtocolVersion.V7_2
	) as Array<Commands.SuperSourceBoxParametersCommand>

	expect(commands).toHaveLength(0)

	SSRC2.boxes[0] = ssBox
})

test('Unit: super source boxes: new box', function () {
	SSRC1.boxes[0] = jsonClone(Defaults.Video.SuperSourceBox)
	const commands = collect(
		(c) => resolveSuperSourceState(c, [SSRC1], [SSRC2], fullDiff),
		Enums.ProtocolVersion.V7_2
	) as Array<Commands.SuperSourceBoxParametersCommand>

	expect(commands[0].constructor.name).toEqual('SuperSourceBoxParametersCommand')
	expect(commands[0].boxId).toEqual(0)
	expect(commands[0].flag).toEqual(1023)
	expect(commands[0].properties).toEqual({
		enabled: true,
		source: 1,
		x: 1,
		y: 1,
		size: 1,
		cropped: true,
		cropTop: 1,
		cropBottom: 1,
		cropLeft: 1,
		cropRight: 1,
	})

	SSRC1.boxes[0] = SSRC2.boxes[0]
})

test('Unit: super source properties: same state gives no commands', function () {
	// same state gives no commands:
	const commands = collect((c) => resolveSuperSourcePropertiesState(c, SSRC1, SSRC1, fullDiff))
	expect(commands).toHaveLength(0)
})

test('Unit: super source properties: some properties changed', function () {
	SSRC2.properties.artFillSource = 3010
	SSRC2.properties.artOption = 1 // foreground
	const commands = collect((c) =>
		resolveSuperSourcePropertiesState(c, SSRC1, SSRC2, fullDiff)
	) as Array<Commands.SuperSourcePropertiesCommand>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('SuperSourcePropertiesCommand')
	expect(commands[0].flag).toEqual(5)
	expect(commands[0].properties).toEqual({
		artFillSource: 3010,
		artOption: 1,
	})

	SSRC2.properties.artFillSource = SSRC1.properties.artFillSource
	SSRC2.properties.artOption = SSRC1.properties.artOption
})

test('Unit: super source properties v8: some properties changed', function () {
	SSRC2.properties.artFillSource = 3010
	SSRC2.properties.artOption = 1 // foreground
	const commands = collect((c) =>
		resolveSuperSourcePropertiesV8State(c, 0, SSRC1.properties, SSRC2.properties)
	) as Array<Commands.SuperSourcePropertiesV8Command>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('SuperSourcePropertiesV8Command')
	expect(commands[0].flag).toEqual(5)
	expect(commands[0].properties).toEqual({
		artFillSource: 3010,
		artOption: 1,
	})

	SSRC2.properties.artFillSource = SSRC1.properties.artFillSource
	SSRC2.properties.artOption = SSRC1.properties.artOption
})
test('Unit: super source properties v8: no properties changed', function () {
	const commands = collect((c) => resolveSuperSourceState(c, [SSRC1], [SSRC2], fullDiff), Enums.ProtocolVersion.V8_0)
	expect(commands).toHaveLength(0)
})

test('Unit: super source border v8: some properties changed', function () {
	SSRC2.border.borderOuterWidth = 3010
	SSRC2.border.borderEnabled = true

	const commands = collect((c) =>
		resolveSuperSourceBorderV8State(c, 0, SSRC1.border, SSRC2.border)
	) as Array<Commands.SuperSourceBorderCommand>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('SuperSourceBorderCommand')
	expect(commands[0].flag).toEqual(5)
	expect(commands[0].properties).toEqual({
		borderOuterWidth: 3010,
		borderEnabled: true,
	})

	SSRC2.border.borderOuterWidth = SSRC1.border.borderOuterWidth
	SSRC2.border.borderEnabled = SSRC1.border.borderEnabled
})
