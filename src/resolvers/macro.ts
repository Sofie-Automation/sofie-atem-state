import type { AtemCommandCollector, Macro } from 'atem-connection'
import type { PartialDeep } from 'type-fest'

import { DiffMacroPlayer } from '../diff.js'

export function resolveMacroPlayerState(
	commands: AtemCommandCollector,
	oldPlayer: PartialDeep<Macro.MacroPlayerState> | undefined,
	newPlayer: PartialDeep<Macro.MacroPlayerState> | undefined,
	diffOptions: DiffMacroPlayer
): void {
	// TODO - fill out more

	if (diffOptions.player) {
		if (
			newPlayer &&
			newPlayer.isRunning &&
			newPlayer.macroIndex !== undefined &&
			(!oldPlayer || !oldPlayer.isRunning || oldPlayer.macroIndex !== newPlayer.macroIndex)
		) {
			commands.macroRun(newPlayer.macroIndex)
			// TODO - cancel anything running?
		}
	}
}
