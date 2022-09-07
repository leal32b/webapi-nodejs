export type IntegerGreaterThanZero<T extends number> = number extends T
  ? never
  : `${T}` extends `-${string}` | '0' | `${string}.${string}`
    ? never
    : T
