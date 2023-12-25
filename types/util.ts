export type Unboxed<T> = T extends (infer U)[] ? U : T;
