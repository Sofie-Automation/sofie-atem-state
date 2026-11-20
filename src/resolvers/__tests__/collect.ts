import { AtemCommandCollector, Commands, Enums } from 'atem-connection'

/** Run a resolver against a fresh collector, and return the commands it produced */
export function collect(
	fn: (commands: AtemCommandCollector) => void,
	version = Enums.ProtocolVersion.V8_1_1
): Commands.ISerializableCommand[] {
	return collectWithResult(fn, version).commands
}

/** Run a resolver against a fresh collector, and return the commands it produced along with its return value */
export function collectWithResult<T>(
	fn: (commands: AtemCommandCollector) => T,
	version = Enums.ProtocolVersion.V8_1_1
): { commands: Commands.ISerializableCommand[]; result: T } {
	const commands = new AtemCommandCollector(version)
	const result = fn(commands)
	return { commands: commands.takeCommands(), result }
}
