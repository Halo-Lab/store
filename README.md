# @halo-lab/store

Every application need to handle a cache (also known as _state_).

## Prerequisites

For using this package you should have NodeJS version `12.22.0` and above (that suports ES modules natively) or transpile the package.

## Installing

```sh
npm i @halo-lab/store
```

## Using

The package exports the `store` function for creating reactive data container.

```ts
function store<S extends object>(value: S): Store<S>;
```

It accepts an object whose values are treated as chunks of the cache. To get a data from `Store` object reach a property that are pointed to the needed value.

```ts
const cache = store({ url: "..." });

const url: string = cache.url;
```

For changing a value of some property inside the store you should assign a new value to it.

```ts
// A value inside the cache store will be changed.
cache.url = "https://new.url";
```

Changing the value inside the store is reactive. You can listen to this changes through `on` method of the `Store`.

```ts
// Create subscription.
const onUrlChange = cache.on("url");
// Listen to the url property changes.
onUrlChange((url) => {
	/* Do something */
});
```

`on` method accepts a list of property names which you want to be dependent on. It returns a function that allows to register a listener that will be invoked when those properties change.

```ts
const cache = store({ a: 1, b: "", c: false });

const onABChange = cache.on("a", "b");

onABChange((a, b) => {
	/* ... */
});
```

Latter returns the `unsubscribe` function that stops listening to changes.

```ts
const onUrlChange = cache.on("url");

// ...

const unsubscribe = onUrlChange((url) => {
	/* Do something */
});

// Somewhere in the code...

unsubscribe(); // You do not listen to _url_ changes now.
```

When you delete a property, then listener will be invoked with `undefined` value:

```ts
delete cache.url;
```

## Integrations

For easy using `store` with UI libraries there is a `Pointer` interface that helps interact with any value in the store.

For now, there are integraitons for [React](https://reactjs.org/) and [edelweiss](https://github.com/YevhenKap/edelweiss/). Each of them exports a `createPointer` function that creates `Pointer` instance. It allows to get exact value from the store no matter how deep it is.

> You can create many pointers for one store, but usually it isn't necessary to do so.

### React

For creating pointer you should import `createPointer` function from `@halo-lab/store/react` submodule.

```ts
import { store } from "@halo-lab/store";
import { createPointer } from "@halo-lab/store/react";

const appStore = store({ keyFromStore: { inner: "" } });

const useStoreValue = createPointer(appStore);
```

With pointer you can create reactive container that is depend on a value from the store.

```ts
const [value, setValue] = useStoreValue("keyFromStore");
```

By default, you can get and update the value of `keyFromStore` property in the store. But you can customize what it should return and update by providing `getter` and `setter` arguments.

```ts
const [value, setInnerValue] = useStoreValue(
	({ keyFromStore }) => keyFromStore.inner,
	// You should return new state in setter to trigger update
	// in places where reactive container is used.
	(currentState, newValue) => ({
		...currentState,
		keyFromStore: { ...currentState.keyFromStore, inner: newValue },
	})
);
```

This is useful for create dependency on two or more store values. Also, `getter` and `setter` should be pure functions and do not mutate original store.

### Edelweiss

The same `createPointer` function exist in `@halo-lab/store/edelweiss` submodule. But instead of returning a tuple it returns a `Data` function.

```ts
import { store } from "@halo-lab/store";
import { createPointer } from "@halo-lab/store/edelweiss";

const appStore = store({ key: { inner: "foo" } });

const appStorePointer = createPointer(store);

const keyValue = createPointer("key");
```

And the same `getter` and `setter` parameters are available here.

```ts
const innerValue = useStoreValue(
	({ key }) => key.inner,
	// You should return new state in setter to trigger update
	// in places where reactive container is used.
	(currentState, newValue) => ({
		...currentState,
		key: { ...currentState.key, inner: newValue },
	}),
);
`
```

## Word from author

Have fun ✌️

<a href="https://www.halo-lab.com/?utm_source=github-brifinator-3000">
  <img src="https://api.halo-lab.com/wp-content/uploads/dev_halo.svg" alt="Developed in Halo lab" height="60">
</a>
