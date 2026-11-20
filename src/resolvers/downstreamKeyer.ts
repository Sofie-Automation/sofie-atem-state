import { AtemCommandCollector, Commands as AtemCommands, VideoState } from 'atem-connection'
import { PartialDeep } from 'type-fest'
import * as Defaults from '../defaults'
import { getAllKeysNumber, diffObject, fillDefaults } from '../util'
import { SectionsToDiff } from '../diff'

/**
 * @returns Whether the change needs a mix effect transition to be run
 */
export function resolveDownstreamKeyerState(
	commands: AtemCommandCollector,
	oldDsks: Array<PartialDeep<VideoState.DSK.DownstreamKeyer> | undefined> | undefined,
	newDsks: Array<PartialDeep<VideoState.DSK.DownstreamKeyer> | undefined> | undefined,
	diffOptions: SectionsToDiff['video']
): boolean {
	const canUseMixEffectTransition =
		(Array.isArray(diffOptions?.mixEffects) ? diffOptions?.mixEffects[0] : diffOptions?.mixEffects)?.programPreview ??
		false
	let doTransition = false

	for (const index of getAllKeysNumber(oldDsks, newDsks)) {
		const thisDiffOptions = Array.isArray(diffOptions?.downstreamKeyers)
			? diffOptions?.downstreamKeyers[index]
			: diffOptions?.downstreamKeyers

		if (thisDiffOptions) {
			const oldDsk = fillDefaults(Defaults.Video.DownstreamKeyer, oldDsks?.[index])
			const newDsk = fillDefaults(Defaults.Video.DownstreamKeyer, newDsks?.[index])

			if (thisDiffOptions.properties) {
				resolveDownstreamKeyerPropertiesState(commands, index, oldDsk, newDsk)
			}
			if (thisDiffOptions.mask) {
				resolveDownstreamKeyerMaskState(commands, index, oldDsk, newDsk)
			}

			if (thisDiffOptions.sources) {
				const oldSources = oldDsk.sources ?? Defaults.Video.DownstreamerKeyerSources
				const newSources = newDsk.sources ?? Defaults.Video.DownstreamerKeyerSources

				if (oldSources.fillSource !== newSources.fillSource) {
					commands.setDownstreamKeyFillSource(newSources.fillSource, index)
				}
				if (oldSources.cutSource !== newSources.cutSource) {
					commands.setDownstreamKeyCutSource(newSources.cutSource, index)
				}
			}

			if (thisDiffOptions.onAir) {
				if (!oldDsk.isAuto && newDsk.isAuto) {
					commands.autoDownstreamKey(index)
				} else if (oldDsk.onAir !== newDsk.onAir) {
					if (newDsk.properties?.tie && canUseMixEffectTransition) {
						doTransition = true
					} else {
						// Built by hand, as the helper can't set the runOrderGroup
						const command = new AtemCommands.DownstreamKeyOnAirCommand(index, newDsk.onAir)
						command.runOrderGroup = newDsk.onAir ? 10 : -10 // OnAir command should run after other commands when turning on, and before other commands when turning off
						commands.sendCommand(command)
					}
				}
			}
		}
	}

	return doTransition
}

export function resolveDownstreamKeyerPropertiesState(
	commands: AtemCommandCollector,
	index: number,
	oldDsk: VideoState.DSK.DownstreamKeyer,
	newDsk: VideoState.DSK.DownstreamKeyer
): void {
	if (!oldDsk.properties && !newDsk.properties) return

	const oldProps = fillDefaults(Defaults.Video.DownstreamerKeyerProperties, oldDsk.properties)
	const newProps = fillDefaults(Defaults.Video.DownstreamerKeyerProperties, newDsk.properties)

	commands.setDownstreamKeyGeneralProperties(diffObject(oldProps, newProps), index)

	if (oldProps.rate !== newProps.rate) {
		commands.setDownstreamKeyRate(newProps.rate, index)
	}

	if (oldProps.tie !== newProps.tie) {
		commands.setDownstreamKeyTie(newProps.tie, index)
	}
}

export function resolveDownstreamKeyerMaskState(
	commands: AtemCommandCollector,
	index: number,
	oldDsk: VideoState.DSK.DownstreamKeyer,
	newDsk: VideoState.DSK.DownstreamKeyer
): void {
	if (!oldDsk.properties && !newDsk.properties) return

	const oldProps = fillDefaults(Defaults.Video.DownstreamerKeyerProperties, oldDsk.properties)
	const newProps = fillDefaults(Defaults.Video.DownstreamerKeyerProperties, newDsk.properties)

	commands.setDownstreamKeyMaskSettings(diffObject(oldProps.mask, newProps.mask), index)
}
