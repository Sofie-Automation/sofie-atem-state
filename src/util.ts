import deepMerge from 'deepmerge'
import { PartialDeep } from 'type-fest'

/**
 * Make all optional properties be required and `| undefined`
 * This is useful to ensure that no property is missed, when manually converting between types, but allowing fields to be undefined
 */
export type Complete<T> = {
	[P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>> ? T[P] : T[P] | undefined
}

/**
 * Make all optional properties be required and `| undefined`
 * This is useful to ensure that no property is missed, when manually converting between types, but allowing fields to be undefined
 */
export type DeepComplete<T> = {
	[P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>>
		? DeepComplete<T[P]>
		: DeepComplete<T[P]> | undefined
}

type MutableKeys<T extends object> = {
	[P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T]

type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B

/**
 * Pick the properties of T which are not readonly
 * Based on https://github.com/piotrwitek/utility-types/blob/2ae7412a9edf12f34fedbf594facf43cf04f7e32/src/mapped-types.ts#L112
 */
export type OmitReadonly<T extends object> = Pick<T, MutableKeys<T>>

export function diffObject<T>(oldObj: Partial<T>, newObj: Partial<T>): Partial<T> {
	const diff: Partial<T> = {}
	for (const key in newObj) {
		const typedKey = key as keyof T
		if (
			newObj[typedKey] &&
			oldObj[typedKey] &&
			Array.isArray(newObj[typedKey]) &&
			Array.isArray(oldObj[typedKey])
		) {
			// We need to compare array contents, not the arrays themselves

			const newArr: any[] = newObj[typedKey] as any
			const oldArr: any[] = oldObj[typedKey] as any
			newArr.sort()
			oldArr.sort()

			if (newArr.length !== oldArr.length || !newArr.every((val, index) => val === oldArr[index])) {
				diff[typedKey] = newObj[typedKey] as T[keyof T]
			}
		} else if (newObj[typedKey] !== oldObj[typedKey]) {
			diff[typedKey] = newObj[typedKey]
		}
	}

	return diff
}

function keyIsValid(key: string, oldObj: any, newObj: any) {
	const oldVal = oldObj[key]
	const newVal = newObj[key]
	return (oldVal !== undefined && oldVal !== null) || (newVal !== undefined && newVal !== null)
}

export function getAllKeysString<V>(
	oldObj0: { [key: string]: V } | undefined,
	newObj0: { [key: string]: V } | undefined
): string[] {
	const oldObj = oldObj0 ?? {}
	const newObj = newObj0 ?? {}
	const rawKeys = Object.keys(oldObj).concat(Object.keys(newObj))
	return rawKeys.filter((v, i) => keyIsValid(v, oldObj, newObj) && rawKeys.indexOf(v) === i)
}
export function getAllKeysNumber<V>(
	oldObj0: { [key: number]: V } | Array<V> | undefined,
	newObj0: { [key: number]: V } | Array<V> | undefined
): number[] {
	const oldObj = oldObj0 ?? []
	const newObj = newObj0 ?? []
	const rawKeys = Object.keys(oldObj).concat(Object.keys(newObj))
	return rawKeys
		.filter((v, i) => keyIsValid(v, oldObj, newObj) && rawKeys.indexOf(v) === i)
		.map((v) => parseInt(v, 10))
}

export function jsonClone<T>(src: T): T {
	return JSON.parse(JSON.stringify(src))
}

export function fillDefaults<T extends object>(
	defaults: T,
	val: NoInfer<PartialDeep<T> | PartialDeep<T, { recurseIntoArrays: true }>> | undefined
): T {
	return deepMerge(defaults, (val ?? {}) as Partial<T>, { arrayMerge: (_dest, src) => src })
}
