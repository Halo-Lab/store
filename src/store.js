const getSubscribeFunction =
	(listeners, target, receiver) =>
	(...keys) =>
	(listener) => {
		const index = listeners.push({
			keys,
			listener: () =>
				listener(...keys.map((key) => Reflect.get(target, key, receiver))),
		});

		return () => (listeners[index - 1] = undefined);
	};

const triggerUpdate = (listeners, property) =>
	listeners
		.filter((record) => record !== undefined && record.keys.includes(property))
		.forEach((record) => record.listener());

export const store = (object) => {
	const listeners = [];

	return new Proxy(object, {
		get: (target, property, receiver) =>
			property === 'on'
				? getSubscribeFunction(listeners, target, receiver)
				: Reflect.get(target, property, receiver),
		set: (target, property, value, receiver) => {
			if (!Object.is(value, Reflect.get(target, property, receiver))) {
				Reflect.set(target, property, value, receiver);
				triggerUpdate(listeners, property);
			}

			return true;
		},
		deleteProperty: (target, property) => {
			if (Reflect.has(target, property)) {
				Reflect.deleteProperty(target, property);
				triggerUpdate(listeners, property);
			}

			return true;
		},
	});
};
