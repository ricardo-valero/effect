import * as St from "../../prelude/Structural"

export const MetricLabelSym = Symbol.for("@effect-ts/core/io/Metrics/MetricLabel")
export type MetricLabelSym = typeof MetricLabelSym

/**
 * A `MetricLabel` represents a key value pair that allows analyzing metrics at
 * an additional level of granularity.
 *
 * For example if a metric tracks the response time of a service labels could
 * be used to create separate versions that track response times for different
 * clients.
 *
 * @tsplus type ets/MetricLabel
 * @tsplus companion ets/MetricLabelOps
 */
export class MetricLabel implements St.HasHash, St.HasEquals {
  readonly [MetricLabelSym] = MetricLabelSym

  constructor(readonly key: string, readonly value: string) {}

  get [St.hashSym](): number {
    return St.combineHash(St.hashString(this.key), St.hashString(this.value))
  }

  [St.equalsSym](that: unknown): boolean {
    return isMetricLabel(that) && St.hash(this) === St.hash(that)
  }
}

/**
 * @tsplus static ets/MetricLabelOps __call
 */
export function make(key: string, value: string): MetricLabel {
  return new MetricLabel(key, value)
}

/**
 * @tsplus static ets/MetricLabelOps isMetricLabel
 */
export function isMetricLabel(u: unknown): u is MetricLabel {
  return typeof u === "object" && u != null && MetricLabelSym in u
}