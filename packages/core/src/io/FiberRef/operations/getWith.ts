import type { Effect } from "../../Effect"
import type { XFiberRef } from "../definition"
import { concreteUnified } from "../definition"

/**
 * Gets the value associated with the current fiber and uses it to run the
 * specified effect.
 */
export function getWith_<EA, EB, A, B, R, EC, C>(
  self: XFiberRef<EA, EB, A, B>,
  f: (b: B) => Effect<R, EC, C>,
  __tsplusTrace?: string
): Effect<R, EB | EC, C> {
  concreteUnified(self)
  return self.get.flatMap(f)
}

/**
 * Gets the value associated with the current fiber and uses it to run the
 * specified effect.
 *
 * @ets_data_first getWith_
 */
export function getWith<B, R, EC, C>(
  f: (b: B) => Effect<R, EC, C>,
  __tsplusTrace?: string
) {
  return <EA, EB, A>(self: XFiberRef<EA, EB, A, B>): Effect<R, EB | EC, C> =>
    getWith_(self, f)
}