import type { AtemCommandCollector, Macro } from 'atem-connection'
import { DiffMacroPlayer } from '../diff'
import { PartialDeep } from 'type-fest'

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
