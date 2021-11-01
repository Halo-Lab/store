import * as React from 'react';

export const createPointer = (store) => (keyOrGetter, setter) => {
	const isKey = typeof keyOrGetter === 'string';

	const [value, setValue] = React.useState(
		isKey ? store[keyOrGetter] : keyOrGetter(store),
	);

	React.useEffect(
		() =>
			store.on(...(isKey ? [keyOrGetter] : Object.keys(store)))(() =>
				setValue(isKey ? store[keyOrGetter] : keyOrGetter(store)),
			),
		[],
	);

	return [
		value,
		(other) => {
			const isFunction = typeof other === 'function';

			if (isKey) {
				store[keyOrGetter] = isFunction ? other(store[keyOrGetter]) : other;
			} else if (setter !== undefined) {
				const newState = setter(
					store,
					isFunction ? other(keyOrGetter(store)) : other,
				);

				Object.assign(store, newState);
			}
		},
	];
};
