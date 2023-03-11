export type IntegerGreaterThanZero<NumberType extends number> = number extends NumberType
  ? never
  : `${NumberType}` extends `-${string}` | '0' | `${string}.${string}`
    ? never
    : NumberType
