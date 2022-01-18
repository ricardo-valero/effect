import type { Cause } from "../Cause"
import type { Has } from "../Has"
import type { LoggerSet } from "../Logger/Set"
import type { Supervisor } from "../Supervisor"
import type { RuntimeConfigFlags } from "./Flags"

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

/**
 * A `RuntimeConfig` provides the minimum capabilities necessary to bootstrap
 * execution of `Effect-TS` tasks.
 */
export class RuntimeConfig {
  constructor(
    readonly value: {
      readonly fatal: (defect: unknown) => boolean
      readonly reportFatal: (defect: unknown) => void
      readonly supervisor: Supervisor<any>
      readonly loggers: LoggerSet<Has<string> & Has<Cause<any>>, any>
      readonly flags: RuntimeConfigFlags
      readonly maxOp: number
    }
  ) {}
}