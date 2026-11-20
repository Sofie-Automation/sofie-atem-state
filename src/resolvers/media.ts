import type { AtemCommandCollector, MediaState } from 'atem-connection'
import type { PartialDeep } from 'type-fest'

import * as Defaults from '../defaults/index.js'
import { DiffMediaPlayer } from '../diff.js'
import { diffObject, fillDefaults, getAllKeysNumber } from '../util.js'

export function resolveMediaPlayerState(
	commands: AtemCommandCollector,
	oldPlayers: Array<PartialDeep<MediaState.MediaPlayerState> | undefined> | undefined,
	newPlayers: Array<PartialDeep<MediaState.MediaPlayerState> | undefined> | undefined,
	diffOptions: DiffMediaPlayer | DiffMediaPlayer[]
): void {
	for (const index of getAllKeysNumber(oldPlayers, newPlayers)) {
		const thisDiffOptions = Array.isArray(diffOptions) ? diffOptions[index] : diffOptions

		if (thisDiffOptions) {
			const newPlayer = fillDefaults(Defaults.Video.MediaPlayer, newPlayers?.[index])
			const oldPlayer = fillDefaults(Defaults.Video.MediaPlayer, oldPlayers?.[index])

			if (thisDiffOptions.source) {
				commands.setMediaPlayerSource(diffObject<MediaState.MediaPlayerSource>(oldPlayer, newPlayer), index)
			}

			if (thisDiffOptions.status) {
				commands.setMediaPlayerSettings(diffObject<MediaState.MediaPlayer>(oldPlayer, newPlayer), index)
			}
		}
	}
}
