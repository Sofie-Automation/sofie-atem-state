import { AtemCommandCollector, Enums, SettingsState } from 'atem-connection'
import type { PartialDeep } from 'type-fest'

import * as Defaults from '../../defaults/index.js'
import { DiffMultiViewer, DiffMultiViewerWindows } from '../../diff.js'
import { diffObject, fillDefaults, getAllKeysNumber } from '../../util.js'

export function resolveMultiviewerState(
	commands: AtemCommandCollector,
	oldState: Array<PartialDeep<SettingsState.MultiViewer> | undefined> | undefined,
	newState: Array<PartialDeep<SettingsState.MultiViewer> | undefined> | undefined,
	diffOptions: DiffMultiViewer | DiffMultiViewer[]
): void {
	for (const index of getAllKeysNumber(oldState, newState)) {
		const newMv = newState?.[index]
		const oldMv = oldState?.[index]

		const thisDiffOptions = Array.isArray(diffOptions) ? diffOptions[index] : diffOptions
		if (thisDiffOptions) {
			if (thisDiffOptions.windows && thisDiffOptions.windows.length) {
				resolveMultiviewerWindowsState(commands, index, oldMv?.windows, newMv?.windows, thisDiffOptions.windows)
			}

			const newProps = fillDefaults(Defaults.Multiviewer.Properties, newMv?.properties)
			const oldProps = fillDefaults(Defaults.Multiviewer.Properties, oldMv?.properties)

			if (thisDiffOptions.properties) {
				const props = diffObject<SettingsState.MultiViewerPropertiesState>(oldProps, newProps)
				// From 8.0 the safe area is set per window instead
				if (isV8OrNewer(commands)) delete props.safeAreaEnabled
				commands.setMultiViewerProperties(props, index)

				const oldVuOpacity = oldMv?.vuOpacity ?? Defaults.Multiviewer.VuOpacity
				const newVuOpacity = newMv?.vuOpacity ?? Defaults.Multiviewer.VuOpacity
				if (oldVuOpacity !== newVuOpacity) {
					commands.setMultiViewerVuOpacity(newVuOpacity, index)
				}
			}
		}
	}
}

function isV8OrNewer(commands: AtemCommandCollector): boolean {
	return commands.apiVersion >= Enums.ProtocolVersion.V8_0
}

export function resolveMultiviewerWindowsState(
	commands: AtemCommandCollector,
	index: number,
	oldState: Array<PartialDeep<SettingsState.MultiViewerWindowState> | undefined> | undefined,
	newState: Array<PartialDeep<SettingsState.MultiViewerWindowState> | undefined> | undefined,
	diffOptions: DiffMultiViewerWindows
): void {
	for (const window of getAllKeysNumber(oldState, newState)) {
		const oldWindow = oldState?.[window]
		const newWindow = newState?.[window]

		if (diffOptions === 'all' || diffOptions.includes(window)) {
			const oldSource = oldWindow?.source ?? Defaults.Video.defaultInput
			const newSource = newWindow?.source ?? Defaults.Video.defaultInput
			if (oldSource !== newSource) {
				commands.setMultiViewerWindowSource(newSource, index, window)
			}

			// Before 8.0 the safe area is a property of the whole multiviewer, so can't be set per window
			if (isV8OrNewer(commands)) {
				const oldSafeArea = oldWindow?.safeTitle ?? false
				const newSafeArea = newWindow?.safeTitle ?? false
				if (oldSafeArea !== newSafeArea) {
					commands.setMultiViewerWindowSafeAreaEnabled(newSafeArea, index, window)
				}
			}

			const oldAudioMeter = oldWindow?.audioMeter ?? false
			const newAudioMeter = newWindow?.audioMeter ?? false
			if (oldAudioMeter !== newAudioMeter) {
				commands.setMultiViewerWindowVuEnabled(newAudioMeter, index, window)
			}
		}
	}
}
