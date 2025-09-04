import { Commands as AtemCommands, VideoState } from 'atem-connection'
import { PartialDeep } from 'type-fest'
import * as Defaults from '../defaults'
import { getAllKeysNumber, diffObject, fillDefaults } from '../util'
import { DiffDownstreamKeyer } from '../diff'

export function resolveDownstreamKeyerState(
	oldDsks: Array<PartialDeep<VideoState.DSK.DownstreamKeyer> | undefined> | undefined,
	newDsks: Array<PartialDeep<VideoState.DSK.DownstreamKeyer> | undefined> | undefined,
	diffOptions: DiffDownstreamKeyer | DiffDownstreamKeyer[]
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldDsks, newDsks)) {
		const thisDiffOptions = Array.isArray(diffOptions) ? diffOptions[index] : diffOptions

		if (thisDiffOptions) {
			const oldDsk = fillDefaults(Defaults.Video.DownstreamKeyer, oldDsks?.[index])
			const newDsk = fillDefaults(Defaults.Video.DownstreamKeyer, newDsks?.[index])

			if (thisDiffOptions.properties) {
				commands.push(...resolveDownstreamKeyerPropertiesState(index, oldDsk, newDsk))
			}
			if (thisDiffOptions.mask) {
				commands.push(...resolveDownstreamKeyerMaskState(index, oldDsk, newDsk))
			}

			if (thisDiffOptions.sources) {
				const oldSources = oldDsk.sources ?? Defaults.Video.DownstreamerKeyerSources
				const newSources = newDsk.sources ?? Defaults.Video.DownstreamerKeyerSources

				if (oldSources.fillSource !== newSources.fillSource) {
					commands.push(new AtemCommands.DownstreamKeyFillSourceCommand(index, newSources.fillSource))
				}
				if (oldSources.cutSource !== newSources.cutSource) {
					commands.push(new AtemCommands.DownstreamKeyCutSourceCommand(index, newSources.cutSource))
				}
			}

			if (thisDiffOptions.onAir) {
				if (!oldDsk.isAuto && newDsk.isAuto) {
					commands.push(new AtemCommands.DownstreamKeyAutoCommand(index))
				} else if (oldDsk.onAir !== newDsk.onAir) {
					const command = new AtemCommands.DownstreamKeyOnAirCommand(index, newDsk.onAir)
					command.runOrderGroup = newDsk.onAir ? 10 : -10 // OnAir command should run after other commands when turning on, and before other commands when turning off
					commands.push(command)
				}
			}
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
