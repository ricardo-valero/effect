import { Runtime } from "../Fiber/core"

import { bracket_ } from "./bracket_"
import { chain_, forkDaemon } from "./core"
import { Effect } from "./effect"
import { fiberId } from "./fiberId"

/**
 * Fork the effect into a separate fiber wrapping it in a bracket and returining the
 * `use` handle. Acquisition will fork and release will interrupt the fiber
 */
export const bracketFiber_ = <S, R, E, A, S2, R2, E2, A2>(
  effect: Effect<S, R, E, A>,
  use: (f: Runtime<E, A>) => Effect<S2, R2, E2, A2>
) =>
  bracket_(forkDaemon(effect), (f) => chain_(fiberId(), (id) => f.interruptAs(id)), use)
