type ToTuple<T extends ReadonlyArray<unknown>> = [...T];

type ToValues<
	O extends object,
	K extends ReadonlyArray<keyof O>,
	V extends ReadonlyArray<unknown> = []
> = K["length"] extends 0
	? V
	: ToValues<O, K extends [any, ...infer T] ? T : [], [...V, O[K[0]]]>;

/**
 * Function that does some action with
 * emitted value.
 */
export interface Listener<A extends ReadonlyArray<unknown>> {
	(...values: A): void;
}

export type Store<T extends object> = T & {
	readonly on: <P extends ReadonlyArray<keyof T>>(
		...properties: P
	) => (listener: Listener<ToValues<T, ToTuple<P>>>) => VoidFunction;
};
