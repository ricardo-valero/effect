export const clamp = <T extends number, U extends [T, T]>(value: T, range: U | Readonly<U>) =>
  Math.min(Math.max(value, range[0]), range[1])

export const hexToRgbTuple = (hexNumber: number): [number, number, number] => {
  const r = (hexNumber >> 16) & 0xFF
  const g = (hexNumber >> 8) & 0xFF
  const b = hexNumber & 0xFF
  return [r, g, b] as const
}
