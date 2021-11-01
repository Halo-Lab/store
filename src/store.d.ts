import { Store } from './types.d';

/** Creates reactive store. */
export function store<S extends object>(object: S): Store<S>;
