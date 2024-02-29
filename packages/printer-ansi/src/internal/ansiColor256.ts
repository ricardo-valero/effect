import { Match } from "effect"
import type { AnsiColor256 } from "../AnsiColor256.js"
import { clamp } from "./utils.js"

// -----------------------------------------------------------------------------
// Constructors
// -----------------------------------------------------------------------------

/** @internal */
export const ansiColor256 = (index: number): AnsiColor256 => ({
  _tag: "AnsiColor256",
  index
})

// -----------------------------------------------------------------------------
// Destructors
// -----------------------------------------------------------------------------

/** @internal */
export const toCode = (color: AnsiColor256): number =>
  Match.value(color).pipe(
    Match.when(Match.number, (index) => clamp(Math.floor(index), [0, 255])),
    Match.orElse(() => 0)
  )
