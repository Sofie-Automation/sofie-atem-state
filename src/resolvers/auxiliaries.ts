import type { AtemCommandCollector } from 'atem-connection'

import * as Defaults from '../defaults/index.js'
import { DiffAuxiliaries } from '../diff.js'
import { getAllKeysNumber } from '../util.js'

export function resolveAuxiliaries(
	commands: AtemCommandCollector,
	oldState: Array<number | undefined> | undefined,
	newState: Array<number | undefined> | undefined,
	diffOptions: DiffAuxiliaries
): void {
	for (const index of getAllKeysNumber(oldState, newState)) {
		if (diffOptions === 'all' || diffOptions.includes(index)) {
			const oldSource = oldState?.[index] ?? Defaults.Video.defaultInput
			const newSource = newState?.[index] ?? Defaults.Video.defaultInput

			if (oldSource !== newSource) {
				commands.setAuxSource(newSource, index)
			}
		}
	}
}
