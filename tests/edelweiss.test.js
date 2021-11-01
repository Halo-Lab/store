import './dom.js';

import { test } from 'uvu';
import { effect } from '@prostory/edelweiss';
import { type, is, equal } from 'uvu/assert';

import { store } from '../src/store.js';
import { createPointer } from '../src/edelweiss.js';

test('should return function', () => {
	const testStore = store({ h: 0 });

	const hPointer = createPointer(testStore);

	type(hPointer, 'function');
});

test('should create getter/setter of value in the store by default', () => {
	const testStore = store({ value: 0 });

	const pointer = createPointer(testStore);
	const state = pointer('value');

	is(state(), 0);

	state(1);

	is(testStore.value, 1);
});

test('should be able to accept custom getter and setter functions', () => {
	const testStore = store({ value: { a: 0 } });

	const pointer = createPointer(testStore);
	const state = pointer(
		({ value }) => value.a,
		(old, a) => ({ ...old, value: { a } }),
	);

	is(state(), 0);

	state(1);

	equal(testStore.value, { a: 1 });
});

test('should create reactive container', () => {
	const testStore = store({ value: { a: 0 } });

	const pointer = createPointer(testStore);
	const state = pointer(
		({ value }) => value.a,
		(old, a) => ({ ...old, value: { a } }),
	);

	let value = 0;
	effect(() => (value = state()));

	state(3);

	is(value, 3);
});

test.run();
