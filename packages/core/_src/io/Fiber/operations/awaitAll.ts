/**
 * Awaits on all fibers to be completed, successfully or not.
 *
 * @tsplus static ets/Fiber/Ops awaitAll
 */
export function awaitAll(
  fibers: Collection<Fiber<any, any>>,
  __tsplusTrace?: string
): Effect<never, never, void> {
  return Fiber.collectAll(fibers).await().unit()
}
