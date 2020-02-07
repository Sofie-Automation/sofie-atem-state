import {
	Commands as AtemCommands,
	Enums } from 'atem-connection'
import { State as StateObject } from '../'

import { resolveMixEffectsState } from './mixEffect'
import { resolveDownstreamKeyerState } from './downstreamKeyer'
import { resolveSuperSourceState } from './supersource'
import { resolveAudioState } from './audio'
import { resolveMacroPlayerState } from './macro'
import { resolveMediaPlayerState } from './media'

export function videoState (oldState: StateObject, newState: StateObject, version: Enums.ProtocolVersion): Array<AtemCommands.AbstractCommand> {
	let commands: Array<AtemCommands.AbstractCommand> = []

	commands = commands.concat(resolveMixEffectsState(oldState, newState))
	commands = commands.concat(resolveMacroPlayerState(oldState, newState))
	commands = commands.concat(resolveDownstreamKeyerState(oldState, newState))
	commands = commands.concat(resolveSuperSourceState(oldState, newState, version))
	commands = commands.concat(resolveAudioState(oldState, newState))
	commands = commands.concat(resolveMediaPlayerState(oldState, newState))

	// resolve auxilliaries:
	for (const index in newState.video.auxilliaries) {
		if (oldState.video.auxilliaries[index] !== newState.video.auxilliaries[index]) {
			const command = new AtemCommands.AuxSourceCommand()
			command.auxBus = Number(index)
			command.updateProps({ source: newState.video.auxilliaries[index] })
			commands.push(command)
		}
	}

	return commands
}
