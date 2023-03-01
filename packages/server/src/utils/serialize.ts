export const serialize = <T = any>(v: T) => JSON.parse(JSON.stringify(v)) as T;
