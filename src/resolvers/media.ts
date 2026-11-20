import type { AtemCommandCollector, MediaState } from 'atem-connection'
import { PartialDeep } from 'type-fest'
import * as Defaults from '../defaults'
import { diffObject, fillDefaults, getAllKeysNumber } from '../util'
import { DiffMediaPlayer } from '../diff'

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
