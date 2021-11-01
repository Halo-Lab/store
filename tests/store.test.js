import { test } from 'uvu';
import { type, is } from 'uvu/assert';

import { store } from '../src/store.js';

test('on method should return function', () => {
	const testStore = store({ k: '' });

	type(testStore.on(), 'function');
});

test('should reactively update value', () => {
	let updated = false;

	const reactive = store({ mark: false });

	reactive.on('mark')((value) => (updated = value));

	is(updated, false);

	reactive.mark = true;

	is(updated, true);
});

test("should return store's value", () => {
	const reactive = store({ mark: false });

	is(reactive.mark, false);
});

test('should delete attached listener', () => {
	let updated = false;

	const reactive = store({ mark: false });

	const unsubscribe = reactive.on('mark')((value) => (updated = value));
	unsubscribe();

	reactive.mark = true;

	is(updated, false);
});

test('should update listeners with undefined value when property was deleted', () => {
	let flag = false;

	const reactive = store({ u: 'foo' });

	reactive.on('u')((value) => (flag = Boolean(value)));

	is(flag, false);

	reactive.u = 'baz';

	is(flag, true);

	delete reactive.u;

	is(flag, false);

	reactive.u = 'new';

	is(flag, true);
});

test('should allow on to two values', () => {
	let count = 0;

	const testStore = store({ h: 0, u: 1 });

	testStore.on('h', 'u')((h, u) => (count += h + u));

	testStore.h = 1;

	is(count, 2);
});

test.run();
