import * as Effect from "effect/Effect"
import * as Scheduler from "effect/Scheduler"
import * as it from "effect/test/utils/extend"
import { assert, describe } from "vitest"

describe("Effect", () => {
  it.effect("matrix schedules according to priority", () =>
    Effect.gen(function*($) {
      const ps000: Array<number> = []
      const ps100: Array<number> = []
      const ps200: Array<number> = []
      const scheduler = Scheduler.makeMatrix(
        [
          0,
          Scheduler.makeBatched((runBatch) => {
            ps000.push(0)
            setTimeout(runBatch, 0)
          })
        ],
        [
          100,
          Scheduler.makeBatched((runBatch) => {
            ps100.push(100)
            setTimeout(runBatch, 0)
          })
        ],
        [
          200,
          Scheduler.makeBatched((runBatch) => {
            ps200.push(200)
            setTimeout(runBatch, 0)
          })
        ],
        [
          300,
          Scheduler.makeBatched((runBatch) => {
            setTimeout(runBatch, 0)
          })
        ]
      )
      yield* $(
        Effect.yieldNow(),
        Effect.withScheduler(scheduler)
      )
      assert.deepEqual(ps000, [0])
      yield* $(
        Effect.yieldNow({ priority: 50 }),
        Effect.withScheduler(scheduler)
      )
      assert.deepEqual(ps000, [0, 0])
      yield* $(
        Effect.yieldNow({ priority: 100 }),
        Effect.withScheduler(scheduler)
      )
      assert.deepEqual(ps100, [100])
      yield* $(
        Effect.yieldNow({ priority: 150 }),
        Effect.withScheduler(scheduler)
      )
      assert.deepEqual(ps100, [100, 100])
      yield* $(
        Effect.yieldNow({ priority: 200 }),
        Effect.withScheduler(scheduler)
      )
      assert.deepEqual(ps100, [100, 100])
      assert.deepEqual(ps200, [200])
      yield* $(
        Effect.yieldNow({ priority: 300 }),
        Effect.withScheduler(scheduler)
      )
      assert.deepEqual(ps100, [100, 100])
      assert.deepEqual(ps200, [200])
    }))
})
