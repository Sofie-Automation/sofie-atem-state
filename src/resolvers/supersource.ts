import { AtemCommandCollector, Commands as AtemCommands, VideoState } from 'atem-connection'
import type { PartialDeep } from 'type-fest'

import * as Defaults from '../defaults/index.js'
import { DiffSuperSource, DiffSuperSourceBoxes } from '../diff.js'
import { diffObject, fillDefaults, getAllKeysNumber } from '../util.js'

type SuperSourceCombinedProperties = VideoState.SuperSource.SuperSourceProperties &
	VideoState.SuperSource.SuperSourceBorder

export function resolveSuperSourceState(
	commands: AtemCommandCollector,
	oldSuperSources: Array<PartialDeep<VideoState.SuperSource.SuperSource> | undefined> | undefined,
	newSuperSources: Array<PartialDeep<VideoState.SuperSource.SuperSource> | undefined> | undefined,
	diffOptions: DiffSuperSource | DiffSuperSource[]
): void {
	const keys = getAllKeysNumber(oldSuperSources, newSuperSources).sort()

	if (commands.apiVersion < AtemCommands.SuperSourcePropertiesV8Command.minimumVersion) {
		for (const index of keys) {
			if (index !== 0) {
				// 8.0 added support for multiple ssrc. So only run for the first
				continue
			}

			const thisDiffOptions = Array.isArray(diffOptions) ? diffOptions[index] : diffOptions

			const newSSrc = newSuperSources?.[index]
			const oldSSrc = oldSuperSources?.[index]

			if (thisDiffOptions.boxes) {
				resolveSuperSourceBoxesState(commands, index, oldSSrc?.boxes, newSSrc?.boxes, thisDiffOptions.boxes)
			}

			resolveSuperSourcePropertiesState(commands, oldSSrc, newSSrc, thisDiffOptions)
		}
	} else {
		for (const index of keys) {
			const thisDiffOptions = Array.isArray(diffOptions) ? diffOptions[index] : diffOptions

			const newSSrc = newSuperSources?.[index]
			const oldSSrc = oldSuperSources?.[index]

			if (thisDiffOptions.boxes) {
				resolveSuperSourceBoxesState(commands, index, oldSSrc?.boxes, newSSrc?.boxes, thisDiffOptions.boxes)
			}
			if (thisDiffOptions.properties) {
				resolveSuperSourcePropertiesV8State(commands, index, oldSSrc?.properties, newSSrc?.properties)
			}
			if (thisDiffOptions.border) {
				resolveSuperSourceBorderV8State(commands, index, oldSSrc?.border, newSSrc?.border)
			}
		}
	}
}

export function resolveSuperSourceBoxesState(
	commands: AtemCommandCollector,
	ssrcId: number,
	oldBoxes: Array<PartialDeep<VideoState.SuperSource.SuperSourceBox> | undefined> | undefined,
	newBoxes: Array<PartialDeep<VideoState.SuperSource.SuperSourceBox> | undefined> | undefined,
	diffOptions: DiffSuperSourceBoxes
): void {
	for (const index of getAllKeysNumber(oldBoxes, newBoxes)) {
		if (diffOptions === 'all' || diffOptions.includes(index)) {
			const oldBox = fillDefaults(Defaults.Video.SuperSourceBox, oldBoxes?.[index])
			const newBox = fillDefaults(Defaults.Video.SuperSourceBox, newBoxes?.[index])

			commands.setSuperSourceBoxSettings(diffObject(oldBox, newBox), Number(index), ssrcId)
		}
	}
}

/**
 * Before 8.0, the properties and border are a single command
 */
export function resolveSuperSourcePropertiesState(
	commands: AtemCommandCollector,
	oldState: PartialDeep<VideoState.SuperSource.SuperSource> | undefined,
	newState: PartialDeep<VideoState.SuperSource.SuperSource> | undefined,
	diffOptions: DiffSuperSource
): void {
	if (!newState && !oldState) return
	if (!diffOptions.border && !diffOptions.properties) return

	const ssrcDefaults = { properties: Defaults.Video.SuperSourceProperties, border: Defaults.Video.SuperSourceBorder }
	const newSSrc = fillDefaults(ssrcDefaults, newState)
	const oldSSrc = fillDefaults(ssrcDefaults, oldState)

	const newProperties: Partial<SuperSourceCombinedProperties> = {}
	const oldProperties: Partial<SuperSourceCombinedProperties> = {}

	if (diffOptions.properties) {
		Object.assign(newProperties, newSSrc.properties)
		Object.assign(oldProperties, oldSSrc.properties)
	}
	if (diffOptions.border) {
		Object.assign(newProperties, newSSrc.border)
		Object.assign(oldProperties, oldSSrc.border)
	}

	// Built by hand, as the helpers send the properties and border as separate commands
	const props = diffObject(oldProperties, newProperties)
	const command = new AtemCommands.SuperSourcePropertiesCommand()
	if (command.updateProps(props)) {
		commands.sendCommand(command)
	}
}

export function resolveSuperSourcePropertiesV8State(
	commands: AtemCommandCollector,
	ssrcId: number,
	oldProperties: PartialDeep<VideoState.SuperSource.SuperSourceProperties> | undefined,
	newProperties: PartialDeep<VideoState.SuperSource.SuperSourceProperties> | undefined
): void {
	const newSSrcProps = fillDefaults(Defaults.Video.SuperSourceProperties, newProperties)
	const oldSSrcProps = fillDefaults(Defaults.Video.SuperSourceProperties, oldProperties)

	commands.setSuperSourceProperties(diffObject(oldSSrcProps, newSSrcProps), ssrcId)
}

export function resolveSuperSourceBorderV8State(
	commands: AtemCommandCollector,
	ssrcId: number,
	oldBorder: PartialDeep<VideoState.SuperSource.SuperSourceBorder> | undefined,
	newBorder: PartialDeep<VideoState.SuperSource.SuperSourceBorder> | undefined
): void {
	const newSSrcBorder = fillDefaults(Defaults.Video.SuperSourceBorder, newBorder)
	const oldSSrcBorder = fillDefaults(Defaults.Video.SuperSourceBorder, oldBorder)

	commands.setSuperSourceBorder(diffObject(oldSSrcBorder, newSSrcBorder), ssrcId)
}
