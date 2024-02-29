export const clamp = <T extends number, U extends [T, T]>(value: T, range: U | Readonly<U>) =>
  Math.min(Math.max(value, range[0]), range[1])
