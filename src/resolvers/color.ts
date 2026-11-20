import type { AtemCommandCollector, ColorGeneratorState } from 'atem-connection'
import { PartialDeep } from 'type-fest'
import * as Defaults from '../defaults'
import { diffObject, fillDefaults, getAllKeysNumber } from '../util'
import { DiffColorGenerators } from '../diff'

export function resolveColorState(
	commands: AtemCommandCollector,
	oldState: PartialDeep<{ [index: number]: ColorGeneratorState | undefined }> | undefined,
	newState: PartialDeep<{ [index: number]: ColorGeneratorState | undefined }> | undefined,
	diffOptions: DiffColorGenerators
): void {
	for (const index of getAllKeysNumber(oldState, newState)) {
		if (diffOptions === 'all' || diffOptions.includes(index)) {
			const newColor = fillDefaults(Defaults.Color.ColorGenerator, newState?.[index])
			const oldColor = fillDefaults(Defaults.Color.ColorGenerator, oldState?.[index])

			commands.setColorGeneratorColour(diffObject<ColorGeneratorState>(oldColor, newColor), index)
		}
	}
}
