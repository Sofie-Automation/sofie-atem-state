import { AtemCommandCollector, Commands, Enums, AtemStateUtil } from 'atem-connection'
import { State as StateObject } from './state'
import * as Resolvers from './resolvers'
import { SectionsToDiff } from './diff'

export class AtemState {
	version: Enums.ProtocolVersion = Enums.ProtocolVersion.V7_2

	private _state: StateObject

	public constructor() {
		this._state = AtemStateUtil.Create()
	}

	setState(state: StateObject): void {
		this._state = state
	}

	getState(): StateObject {
		return this._state
	}

	diffState(newState: StateObject, options: SectionsToDiff): Array<Commands.ISerializableCommand> {
		return AtemState.diffStates(this.version, this._state, newState, options)
	}

	static diffStates(
		version: Enums.ProtocolVersion,
		oldState: StateObject,
		newState: StateObject,
		options: SectionsToDiff
	): Array<Commands.ISerializableCommand> {
		const commands = new AtemCommandCollector(version)
		Resolvers.diffState(commands, oldState, newState, options)
		return commands.takeCommands()
	}
}
