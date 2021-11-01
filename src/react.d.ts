import * as React from 'react';

import { Store } from './types.d';

export interface Pointer<T extends object> {
	<K extends keyof T>(key: K): readonly [T[K], React.SetStateAction<T[K]>];
	<A>(getter: (state: T) => A): readonly [A];
	<A>(getter: (state: T) => A, setter: (current: T, value: A) => T): readonly [
		A,
		React.SetStateAction<A>,
	];
}

export function createPointer<T extends object>(store: Store<T>): Pointer<T>;
