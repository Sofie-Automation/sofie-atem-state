import { Commands as AtemCommands, VideoState } from 'atem-connection'
import { PartialDeep } from 'type-fest'
import { State as StateObject } from '../state'
import * as Defaults from '../defaults'
import { getAllKeysNumber, diffObject, fillDefaults } from '../util'

export function resolveDownstreamKeyerState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldState.video?.downstreamKeyers, newState.video?.downstreamKeyers)) {
		const oldDsk = fillDefaults(Defaults.Video.DownstreamKeyer, oldState.video?.downstreamKeyers?.[index])
		const newDsk = fillDefaults(Defaults.Video.DownstreamKeyer, newState.video?.downstreamKeyers?.[index])

		commands.push(...resolveDownstreamKeyerPropertiesState(index, oldDsk, newDsk))
		commands.push(...resolveDownstreamKeyerMaskState(index, oldDsk, newDsk))

		const oldSources = oldDsk.sources ?? Defaults.Video.DownstreamerKeyerSources
		const newSources = newDsk.sources ?? Defaults.Video.DownstreamerKeyerSources

		if (oldSources.fillSource !== newSources.fillSource) {
			commands.push(new AtemCommands.DownstreamKeyFillSourceCommand(index, newSources.fillSource))
		}
		if (oldSources.cutSource !== newSources.cutSource) {
			commands.push(new AtemCommands.DownstreamKeyCutSourceCommand(index, newSources.cutSource))
		}

		if (!oldDsk.isAuto && newDsk.isAuto) {
			commands.push(new AtemCommands.DownstreamKeyAutoCommand(index))
		} else if (oldDsk.onAir !== newDsk.onAir) {
			commands.push(new AtemCommands.DownstreamKeyOnAirCommand(index, newDsk.onAir))
		}
	}

	return commands
}

export function resolveDownstreamKeyerPropertiesState(
	index: number,
	oldDsk: VideoState.DSK.DownstreamKeyer,
	newDsk: VideoState.DSK.DownstreamKeyer
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldDsk.properties && !newDsk.properties) return commands

	const oldProps = fillDefaults(Defaults.Video.DownstreamerKeyerProperties, oldDsk.properties)
	const newProps = fillDefaults(Defaults.Video.DownstreamerKeyerProperties, newDsk.properties)

	const props = diffObject(oldProps, newProps)
	const command = new AtemCommands.DownstreamKeyGeneralCommand(index)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	if (oldProps.rate !== newProps.rate) {
		commands.push(new AtemCommands.DownstreamKeyRateCommand(index, newProps.rate))
	}

	if (oldProps.tie !== newProps.tie) {
		commands.push(new AtemCommands.DownstreamKeyTieCommand(index, newProps.tie))
	}

	return commands
}

export function resolveDownstreamKeyerMaskState(
	index: number,
	oldDsk: VideoState.DSK.DownstreamKeyer,
	newDsk: VideoState.DSK.DownstreamKeyer
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldDsk.properties && !newDsk.properties) return commands

	const oldProps = fillDefaults(Defaults.Video.DownstreamerKeyerProperties, oldDsk.properties)
	const newProps = fillDefaults(Defaults.Video.DownstreamerKeyerProperties, newDsk.properties)

	const props = diffObject(oldProps.mask, newProps.mask)
	const command = new AtemCommands.DownstreamKeyMaskCommand(index)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}
