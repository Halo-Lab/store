import { data } from '@prostory/edelweiss';

export const createPointer = (store) => (keyOrGetter, setter) => {
	const isKey = typeof keyOrGetter === 'string';

	const state = data(isKey ? store[keyOrGetter] : keyOrGetter(store));

	store.on(...(isKey ? [keyOrGetter] : Object.keys(store)))(() =>
		state(isKey ? store[keyOrGetter] : keyOrGetter(store)),
	);

	return (value) => {
		if (value === undefined) {
			return state();
		} else {
			if (isKey) {
				store[keyOrGetter] = value;
			} else if (setter !== undefined) {
				Object.assign(store, setter(store, value));
			}
		}
	};
};
