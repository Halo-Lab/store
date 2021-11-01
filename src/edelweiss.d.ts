import { Computed, Data } from '@prostory/edelweiss';

import { Store } from './types.d';

/** Reactive pointer to specific fiels in store. */
export interface Pointer<S extends object> {
	<K extends keyof S>(key: K): Data<S[K]>;
	<A>(getter: (state: S) => A): Computed<A>;
	<A>(getter: (state: S) => A, setter: (current: S, value: A) => S): Data<A>;
}

/** Creates reactive pointer(getter/setter) of a value from a store. */
export function createPointer<T extends object>(store: Store<T>): Pointer<T>;
