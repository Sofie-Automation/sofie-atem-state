import { OmitReadonly } from 'atem-connection/dist/lib/types'
import { PartialDeep } from 'type-fest'
import type { AtemCommandCollector, Commands as AtemCommands, Fairlight } from 'atem-connection'

import * as Defaults from '../defaults/index.js'
import {
	DiffFairlightAudio,
	DiffFairlightAudioInput,
	DiffFairlightAudioInputSource,
	DiffFairlightAudioRouting,
} from '../diff.js'
import { diffObject, fillDefaults, getAllKeysNumber, getAllKeysString } from '../util.js'

export function resolveFairlightAudioState(
	commands: AtemCommandCollector,
	oldState: PartialDeep<Fairlight.AtemFairlightAudioState> | undefined,
	newState: PartialDeep<Fairlight.AtemFairlightAudioState> | undefined,
	diffOptions: DiffFairlightAudio
): void {
	if (oldState || newState) {
		resolveFairlightAudioMixerOutputsState(commands, oldState, newState, diffOptions)

		if (diffOptions.inputs) {
			resolveFairlightAudioMixerInputsState(commands, oldState, newState, diffOptions.inputs)
		}

		if (diffOptions.crossfade) {
			const oldAfv = oldState?.audioFollowVideoCrossfadeTransitionEnabled ?? false
			const newAfv = newState?.audioFollowVideoCrossfadeTransitionEnabled ?? false
			if (oldAfv !== newAfv) {
				commands.setFairlightAudioMixerProps({ audioFollowVideo: newAfv })
			}
		}

		if (diffOptions.audioRouting && (oldState?.audioRouting || newState?.audioRouting)) {
			resolveFairlightAudioRoutingState(
				commands,
				oldState?.audioRouting,
				newState?.audioRouting,
				diffOptions.audioRouting
			)
		}
	}
}

function buildMasterPropertiesCommandState(
	master: PartialDeep<Fairlight.FairlightAudioMasterChannel> | undefined
): AtemCommands.FairlightMixerMasterCommandProperties {
	const properties = fillDefaults(Defaults.FairlightAudio.Master, master?.properties)
	const eq = fillDefaults(Defaults.FairlightAudio.Equalizer, master?.equalizer)
	const dynamics = fillDefaults(Defaults.FairlightAudio.Dynamics, master?.dynamics)

	return {
		...properties,
		equalizerEnabled: eq.enabled,
		equalizerGain: eq.gain,
		makeUpGain: dynamics.makeUpGain,
	}
}

export function resolveFairlightAudioMixerOutputsState(
	commands: AtemCommandCollector,
	oldState: PartialDeep<Fairlight.AtemFairlightAudioState> | undefined,
	newState: PartialDeep<Fairlight.AtemFairlightAudioState> | undefined,
	diffOptions: DiffFairlightAudio
): void {
	if (diffOptions.masterOutput) {
		if (diffOptions.masterOutput.properties) {
			const oldMaster = buildMasterPropertiesCommandState(oldState?.master)
			const newMaster = buildMasterPropertiesCommandState(newState?.master)

			commands.setFairlightAudioMixerMasterProps(
				diffObject<AtemCommands.FairlightMixerMasterCommandProperties>(oldMaster, newMaster)
			)
		}

		if (diffOptions.masterOutput.dynamics) {
			{
				const oldLimiter = fillDefaults(
					Defaults.FairlightAudio.DynamicsLimiter,
					oldState?.master?.dynamics?.limiter
				)
				const newLimiter = fillDefaults(
					Defaults.FairlightAudio.DynamicsLimiter,
					newState?.master?.dynamics?.limiter
				)

				commands.setFairlightAudioMixerMasterLimiterProps(
					diffObject<Fairlight.FairlightAudioLimiterState>(oldLimiter, newLimiter)
				)
			}

			if (diffOptions.masterOutput.properties) {
				const oldCompressor = fillDefaults(
					Defaults.FairlightAudio.DynamicsCompressor,
					oldState?.master?.dynamics?.compressor
				)
				const newCompressor = fillDefaults(
					Defaults.FairlightAudio.DynamicsCompressor,
					newState?.master?.dynamics?.compressor
				)

				commands.setFairlightAudioMixerMasterCompressorProps(
					diffObject<Fairlight.FairlightAudioCompressorState>(oldCompressor, newCompressor)
				)
			}
		}

		if (diffOptions.masterOutput.equalizer) {
			for (const band of getAllKeysNumber(
				oldState?.master?.equalizer?.bands,
				newState?.master?.equalizer?.bands
			)) {
				const oldBand = fillDefaults(
					Defaults.FairlightAudio.DynamicsEqualizerBand,
					oldState?.master?.equalizer?.bands?.[band]
				)
				const newBand = fillDefaults(
					Defaults.FairlightAudio.DynamicsEqualizerBand,
					newState?.master?.equalizer?.bands?.[band]
				)

				commands.setFairlightAudioMixerMasterEqualizerBandProps(
					band,
					diffObject<Fairlight.FairlightAudioEqualizerBandState>(oldBand, newBand)
				)
			}
		}
	}

	if (diffOptions.monitorOutput) {
		const oldMonitor = fillDefaults(Defaults.FairlightAudio.Monitor, oldState?.monitor)
		const newMonitor = fillDefaults(Defaults.FairlightAudio.Monitor, newState?.monitor)

		commands.setFairlightAudioMixerMonitorProps(
			diffObject<Fairlight.FairlightAudioMonitorChannel>(oldMonitor, newMonitor)
		)
	}
}

export function resolveFairlightAudioMixerInputsState(
	commands: AtemCommandCollector,
	oldState: PartialDeep<Fairlight.AtemFairlightAudioState> | undefined,
	newState: PartialDeep<Fairlight.AtemFairlightAudioState> | undefined,
	diffOptions: Record<number | 'default', DiffFairlightAudioInput | undefined>
): void {
	for (const index of getAllKeysNumber(oldState?.inputs, newState?.inputs)) {
		const thisDiffOptions = diffOptions[index] ?? diffOptions['default']

		const oldInput = oldState?.inputs?.[index]
		const newInput = newState?.inputs?.[index]

		if (thisDiffOptions?.properties) {
			const oldProperties = fillDefaults(Defaults.FairlightAudio.InputProperties, oldInput?.properties)
			const newProperties = fillDefaults(Defaults.FairlightAudio.InputProperties, newInput?.properties)

			commands.setFairlightAudioMixerInputProps(
				index,
				diffObject<Fairlight.FairlightAudioInputProperties>(oldProperties, newProperties)
			)
		}

		if (thisDiffOptions?.sources) {
			resolveFairlightAudioMixerInputSourcesState(commands, index, oldInput, newInput, thisDiffOptions.sources)
		}
	}
}

function buildSourcePropertiesCommandState(
	source: PartialDeep<Fairlight.FairlightAudioSource> | undefined
): AtemCommands.FairlightMixerSourceCommandProperties {
	const properties = fillDefaults(Defaults.FairlightAudio.SourceProperties, source?.properties)
	const eq = fillDefaults(Defaults.FairlightAudio.Equalizer, source?.equalizer)
	const dynamics = fillDefaults(Defaults.FairlightAudio.Dynamics, source?.dynamics)

	return {
		...properties,
		equalizerEnabled: eq.enabled,
		equalizerGain: eq.gain,
		makeUpGain: dynamics.makeUpGain,
	}
}

export function resolveFairlightAudioMixerInputSourcesState(
	commands: AtemCommandCollector,
	index: number,
	oldInput: PartialDeep<Fairlight.FairlightAudioInput> | undefined,
	newInput: PartialDeep<Fairlight.FairlightAudioInput> | undefined,
	diffOptions: Record<number | 'default', DiffFairlightAudioInputSource | undefined>
): void {
	for (const sourceId of getAllKeysString(oldInput?.sources, newInput?.sources)) {
		const thisDiffOptions = diffOptions[index] ?? diffOptions['default']

		const oldSource = oldInput?.sources?.[sourceId]
		const newSource = newInput?.sources?.[sourceId]

		if (thisDiffOptions?.properties) {
			const oldProperties = buildSourcePropertiesCommandState(oldSource)
			const newProperties = buildSourcePropertiesCommandState(newSource)

			commands.setFairlightAudioMixerSourceProps(
				index,
				sourceId,
				diffObject<AtemCommands.FairlightMixerSourceCommandProperties>(oldProperties, newProperties)
			)
		}

		if (thisDiffOptions?.dynamics) {
			{
				const oldLimiter = fillDefaults(Defaults.FairlightAudio.DynamicsLimiter, oldSource?.dynamics?.limiter)
				const newLimiter = fillDefaults(Defaults.FairlightAudio.DynamicsLimiter, newSource?.dynamics?.limiter)

				commands.setFairlightAudioMixerSourceLimiterProps(
					index,
					sourceId,
					diffObject<Fairlight.FairlightAudioLimiterState>(oldLimiter, newLimiter)
				)
			}

			{
				const oldCompressor = fillDefaults(
					Defaults.FairlightAudio.DynamicsCompressor,
					oldSource?.dynamics?.compressor
				)
				const newCompressor = fillDefaults(
					Defaults.FairlightAudio.DynamicsCompressor,
					newSource?.dynamics?.compressor
				)

				commands.setFairlightAudioMixerSourceCompressorProps(
					index,
					sourceId,
					diffObject<Fairlight.FairlightAudioCompressorState>(oldCompressor, newCompressor)
				)
			}

			{
				const oldExpander = fillDefaults(
					Defaults.FairlightAudio.DynamicsExpander,
					oldSource?.dynamics?.expander
				)
				const newExpander = fillDefaults(
					Defaults.FairlightAudio.DynamicsExpander,
					newSource?.dynamics?.expander
				)

				commands.setFairlightAudioMixerSourceExpanderProps(
					index,
					sourceId,
					diffObject<Fairlight.FairlightAudioExpanderState>(oldExpander, newExpander)
				)
			}
		}

		if (thisDiffOptions?.equalizer) {
			for (const band of getAllKeysNumber(oldSource?.equalizer?.bands, newSource?.equalizer?.bands)) {
				const oldBand = fillDefaults(
					Defaults.FairlightAudio.DynamicsEqualizerBand,
					oldSource?.equalizer?.bands?.[band]
				)
				const newBand = fillDefaults(
					Defaults.FairlightAudio.DynamicsEqualizerBand,
					newSource?.equalizer?.bands?.[band]
				)

				commands.setFairlightAudioMixerSourceEqualizerBandProps(
					index,
					sourceId,
					band,
					diffObject<Fairlight.FairlightAudioEqualizerBandState>(oldBand, newBand)
				)
			}
		}
	}
}

export function resolveFairlightAudioRoutingState(
	commands: AtemCommandCollector,
	oldState: PartialDeep<Fairlight.FairlightAudioRouting> | undefined,
	newState: PartialDeep<Fairlight.FairlightAudioRouting> | undefined,
	diffOptions: DiffFairlightAudioRouting
): void {
	if (diffOptions.sources) {
		for (const sourceId of getAllKeysNumber(oldState?.sources, newState?.sources)) {
			const thisDiffOptions = diffOptions.sources[sourceId] ?? diffOptions.sources['default']

			if (thisDiffOptions?.name) {
				const oldProperties = fillDefaults<OmitReadonly<Fairlight.FairlightAudioRoutingSource>>(
					{ name: `Source ${sourceId}` },
					oldState?.sources?.[sourceId]
				)
				const newProperties = fillDefaults<OmitReadonly<Fairlight.FairlightAudioRoutingSource>>(
					{ name: `Source ${sourceId}` },
					newState?.sources?.[sourceId]
				)

				commands.setFairlightAudioRoutingSourceProperties(
					sourceId,
					diffObject<OmitReadonly<Fairlight.FairlightAudioRoutingSource>>(oldProperties, newProperties)
				)
			}
		}
	}

	if (diffOptions.outputs) {
		for (const outputId of getAllKeysNumber(oldState?.outputs, newState?.outputs)) {
			const thisDiffOptions = diffOptions.outputs[outputId] ?? diffOptions.outputs['default']

			if (thisDiffOptions) {
				const oldProperties = fillDefaults<OmitReadonly<Fairlight.FairlightAudioRoutingOutput>>(
					{ name: `Output ${outputId}`, sourceId: 0 },
					oldState?.outputs?.[outputId]
				)
				const newProperties = fillDefaults<OmitReadonly<Fairlight.FairlightAudioRoutingOutput>>(
					{ name: `Output ${outputId}`, sourceId: 0 },
					newState?.outputs?.[outputId]
				)

				// Filter out any properties not being diffed
				const props = diffObject<OmitReadonly<Fairlight.FairlightAudioRoutingOutput>>(
					oldProperties,
					newProperties
				)
				if (!thisDiffOptions.name) delete props.name
				if (!thisDiffOptions.sourceId) delete props.sourceId

				commands.setFairlightAudioRoutingOutputProperties(outputId, props)
			}
		}
	}
}
