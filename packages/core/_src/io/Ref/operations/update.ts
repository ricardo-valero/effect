/**
 * Atomically modifies the `Ref` with the specified function.
 *
 * @tsplus fluent ets/Ref update
 */
export function update_<A>(
  self: Ref<A>,
  f: (a: A) => A,
  __tsplusTrace?: string
): Effect<never, never, void> {
  return self.modify((v) => Tuple(undefined, f(v)))
}

/**
 * Atomically modifies the `Ref` with the specified function.
 *
 * @tsplus static ets/Ref/Aspects update
 */
export const update = Pipeable(update_)
