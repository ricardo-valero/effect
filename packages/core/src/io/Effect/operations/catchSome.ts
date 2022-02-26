import type { Option } from "../../../data/Option"
import { Effect } from "../definition"

/**
 * Recovers from some or all of the error cases.
 *
 * @tsplus fluent ets/Effect catchSome
 */
export function catchSome_<R, E, A, R2, E2, A2>(
  self: Effect<R, E, A>,
  f: (e: E) => Option<Effect<R2, E2, A2>>,
  __tsplusTrace?: string
): Effect<R & R2, E | E2, A | A2> {
  return self.foldCauseEffect(
    (cause): Effect<R2, E | E2, A2> =>
      cause
        .failureOrCause()
        .fold((x) => f(x).getOrElse(Effect.failCauseNow(cause)), Effect.failCauseNow),
    Effect.succeedNow
  )
}

/**
 * Recovers from some or all of the error cases.
 *
 * @ets_data_first catchSome_
 */
export function catchSome<R, E, A, R2, E2, A2>(
  f: (e: E) => Option<Effect<R2, E2, A2>>,
  __tsplusTrace?: string
) {
  return (self: Effect<R, E, A>): Effect<R & R2, E | E2, A | A2> => self.catchSome(f)
}