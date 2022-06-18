/**
 * Returns an effect with the value on the right part.
 *
 * @tsplus static ets/Effect/Ops right
 */
export function succeedRight<A>(
  value: LazyArg<A>,
  __tsplusTrace?: string
): Effect<never, never, Either<never, A>> {
  return Effect.succeed(Either.right(value()))
}
