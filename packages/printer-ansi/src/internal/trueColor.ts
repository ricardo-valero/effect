import { Match, pipe } from "effect"
import type { TrueColor } from "../TrueColor.js"
import { clamp, hexToRgbTuple } from "./utils.js"

// -----------------------------------------------------------------------------
// Constructors
// -----------------------------------------------------------------------------

/** @internal */
export const trueColor = (hexNumber: number): TrueColor => ({
  _tag: "TrueColor",
  hexNumber
})

// -----------------------------------------------------------------------------
// Destructors
// -----------------------------------------------------------------------------

/** @internal */
export const toCode = (color: TrueColor): Readonly<[number, number, number]> =>
  Match.value(color).pipe(
    Match.when(Match.number, (hexNumber) => pipe(clamp(Math.floor(hexNumber), [0x000000, 0xFFFFFF]), hexToRgbTuple)),
    Match.orElse(() => [0, 0, 0] as const)
  )
