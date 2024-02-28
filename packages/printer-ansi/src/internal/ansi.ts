import * as Monoid from "@effect/typeclass/Monoid"
import * as Semigroup from "@effect/typeclass/Semigroup"
import { dual } from "effect/Function"
import * as Option from "effect/Option"
import * as ReadonlyArray from "effect/ReadonlyArray"
import type * as Ansi from "../Ansi.js"
import type * as Color from "../Color.js"
import * as InternalColor from "./color.js"
import * as Style from "./style.js"

const AnsiSymbolKey = "@effect/printer-ansi/Ansi"

/** @internal */
export const TypeId: Ansi.TypeId = Symbol.for(AnsiSymbolKey) as Ansi.TypeId

interface AnsiImpl extends Ansi.Ansi {
  readonly commands: ReadonlyArray<string>
  readonly foreground: Option.Option<Style.Style>
  readonly background: Option.Option<Style.Style>
  readonly bold: Option.Option<Style.Style>
  readonly strikethrough: Option.Option<Style.Style>
  readonly italic: Option.Option<Style.Style>
  readonly underline: Option.Option<Style.Style>
}

const make = (
  params: Partial<{
    readonly commands: ReadonlyArray<string>
    readonly foreground: Option.Option<Style.Style>
    readonly background: Option.Option<Style.Style>
    readonly bold: Option.Option<Style.Style>
    readonly strikethrough: Option.Option<Style.Style>
    readonly italic: Option.Option<Style.Style>
    readonly underline: Option.Option<Style.Style>
  }>
): Ansi.Ansi => ({
  ...AnsiMonoid.empty,
  ...params
})

// -----------------------------------------------------------------------------
// Instances
// -----------------------------------------------------------------------------

const typeIdSemigroup = Semigroup.first<Ansi.TypeId>()

const getFirstSomeSemigroup: Semigroup.Semigroup<Option.Option<Style.Style>> = Semigroup.make(
  (self, that) => Option.isSome(self) ? self : that
)

const AnsiSemigroup: Semigroup.Semigroup<AnsiImpl> = Semigroup.struct({
  [TypeId]: typeIdSemigroup,
  commands: Semigroup.array<string>(),
  foreground: getFirstSomeSemigroup,
  background: getFirstSomeSemigroup,
  bold: getFirstSomeSemigroup,
  italic: getFirstSomeSemigroup,
  strikethrough: getFirstSomeSemigroup,
  underline: getFirstSomeSemigroup
})

const typeIdMonoid = Monoid.fromSemigroup(typeIdSemigroup, TypeId)

const monoidOrElse = Monoid.fromSemigroup(getFirstSomeSemigroup, Option.none())

const AnsiMonoid: Monoid.Monoid<AnsiImpl> = Monoid.struct({
  [TypeId]: typeIdMonoid,
  commands: Monoid.array<string>(),
  foreground: monoidOrElse,
  background: monoidOrElse,
  bold: monoidOrElse,
  italic: monoidOrElse,
  strikethrough: monoidOrElse,
  underline: monoidOrElse
})

/** @internal */
export const none: Ansi.Ansi = AnsiMonoid.empty

const ESC = "\u001B"
const BEL = "\u0007"
const SEP = ";"
const CSI = `${ESC}[`

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

/** @internal */
export const bold: Ansi.Ansi = make({ bold: Option.some(Style.setBold(true)) })

/** @internal */
export const italic: Ansi.Ansi = make({ italic: Option.some(Style.setItalicized(true)) })

/** @internal */
export const strikethrough: Ansi.Ansi = make({ strikethrough: Option.some(Style.setStrikethrough(true)) })

/** @internal */
export const underline: Ansi.Ansi = make({ underline: Option.some(Style.setUnderlined(true)) })

// -----------------------------------------------------------------------------
// Colors
// -----------------------------------------------------------------------------

/** @internal */
export const fgBrightColor = (color: Color.Color): Ansi.Ansi =>
  make({ foreground: Option.some(Style.setColor(color, true, "foreground")) })

/** @internal */
export const fgColor = (color: Color.Color): Ansi.Ansi =>
  make({ foreground: Option.some(Style.setColor(color, false, "foreground")) })

/** @internal */
export const bgBrightColor = (color: Color.Color): Ansi.Ansi =>
  make({ background: Option.some(Style.setColor(color, true, "background")) })

/** @internal */
export const bgColor = (color: Color.Color): Ansi.Ansi =>
  make({ background: Option.some(Style.setColor(color, false, "background")) })

/** @internal */
export const black: Ansi.Ansi = fgColor(InternalColor.black)

/** @internal */
export const red: Ansi.Ansi = fgColor(InternalColor.red)

/** @internal */
export const green: Ansi.Ansi = fgColor(InternalColor.green)

/** @internal */
export const yellow: Ansi.Ansi = fgColor(InternalColor.yellow)

/** @internal */
export const blue: Ansi.Ansi = fgColor(InternalColor.blue)

/** @internal */
export const magenta: Ansi.Ansi = fgColor(InternalColor.magenta)

/** @internal */
export const cyan: Ansi.Ansi = fgColor(InternalColor.cyan)

/** @internal */
export const white: Ansi.Ansi = fgColor(InternalColor.white)

/** @internal */
export const blackBright: Ansi.Ansi = fgBrightColor(InternalColor.black)

/** @internal */
export const redBright: Ansi.Ansi = fgBrightColor(InternalColor.red)

/** @internal */
export const greenBright: Ansi.Ansi = fgBrightColor(InternalColor.green)

/** @internal */
export const yellowBright: Ansi.Ansi = fgBrightColor(InternalColor.yellow)

/** @internal */
export const blueBright: Ansi.Ansi = fgBrightColor(InternalColor.blue)

/** @internal */
export const magentaBright: Ansi.Ansi = fgBrightColor(InternalColor.magenta)

/** @internal */
export const cyanBright: Ansi.Ansi = fgBrightColor(InternalColor.cyan)

/** @internal */
export const whiteBright: Ansi.Ansi = fgBrightColor(InternalColor.white)

/** @internal */
export const bgBlack: Ansi.Ansi = bgColor(InternalColor.black)

/** @internal */
export const bgRed: Ansi.Ansi = bgColor(InternalColor.red)

/** @internal */
export const bgGreen: Ansi.Ansi = bgColor(InternalColor.green)

/** @internal */
export const bgYellow: Ansi.Ansi = bgColor(InternalColor.yellow)

/** @internal */
export const bgBlue: Ansi.Ansi = bgColor(InternalColor.blue)

/** @internal */
export const bgMagenta: Ansi.Ansi = bgColor(InternalColor.magenta)

/** @internal */
export const bgCyan: Ansi.Ansi = bgColor(InternalColor.cyan)

/** @internal */
export const bgWhite: Ansi.Ansi = bgColor(InternalColor.white)

/** @internal */
export const bgBlackBright: Ansi.Ansi = bgBrightColor(InternalColor.black)

/** @internal */
export const bgRedBright: Ansi.Ansi = bgBrightColor(InternalColor.red)

/** @internal */
export const bgGreenBright: Ansi.Ansi = bgBrightColor(InternalColor.green)

/** @internal */
export const bgYellowBright: Ansi.Ansi = bgBrightColor(InternalColor.yellow)

/** @internal */
export const bgBlueBright: Ansi.Ansi = bgBrightColor(InternalColor.blue)

/** @internal */
export const bgMagentaBright: Ansi.Ansi = bgBrightColor(InternalColor.magenta)

/** @internal */
export const bgCyanBright: Ansi.Ansi = bgBrightColor(InternalColor.cyan)

/** @internal */
export const bgWhiteBright: Ansi.Ansi = bgBrightColor(InternalColor.white)

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

/** @internal */
export const beep: Ansi.Ansi = make({ commands: ReadonlyArray.of(BEL) })

/** @internal */
export const cursorTo = (column: number, row?: number): Ansi.Ansi => {
  if (row === undefined) {
    const command = `${CSI}${Math.max(column + 1, 0)}G`
    return make({ commands: ReadonlyArray.of(command) })
  }
  const command = `${CSI}${row + 1}${SEP}${Math.max(column + 1, 0)}H`
  return make({ commands: ReadonlyArray.of(command) })
}

/** @internal */
export const cursorMove = (column: number, row: number = 0): Ansi.Ansi => {
  let command = ""
  if (row < 0) {
    command += `${CSI}${-row}A`
  }
  if (row > 0) {
    command += `${CSI}${row}B`
  }
  if (column > 0) {
    command += `${CSI}${column}C`
  }
  if (column < 0) {
    command += `${CSI}${-column}D`
  }
  return make({ commands: ReadonlyArray.of(command) })
}

/** @internal */
export const cursorUp = (lines: number = 1): Ansi.Ansi => {
  const command = `${CSI}${lines}A`
  return make({ commands: ReadonlyArray.of(command) })
}

/** @internal */
export const cursorDown = (lines: number = 1): Ansi.Ansi => {
  const command = `${CSI}${lines}B`
  return make({ commands: ReadonlyArray.of(command) })
}

/** @internal */
export const cursorForward = (columns: number = 1): Ansi.Ansi => {
  const command = `${CSI}${columns}C`
  return make({ commands: ReadonlyArray.of(command) })
}

/** @internal */
export const cursorBackward = (columns: number = 1): Ansi.Ansi => {
  const command = `${CSI}${columns}D`
  return make({ commands: ReadonlyArray.of(command) })
}

/** @internal */
export const cursorLeft: Ansi.Ansi = make({ commands: ReadonlyArray.of(`${CSI}G`) })

/** @internal */
export const cursorSavePosition: Ansi.Ansi = make({ commands: ReadonlyArray.of(`${CSI}s`) })

/** @internal */
export const cursorRestorePosition: Ansi.Ansi = make({ commands: ReadonlyArray.of(`${CSI}u`) })

/** @internal */
export const cursorNextLine = (rows: number = 1): Ansi.Ansi => make({ commands: ReadonlyArray.of(`${CSI}${rows}E`) })

/** @internal */
export const cursorPrevLine = (rows: number = 1): Ansi.Ansi => make({ commands: ReadonlyArray.of(`${CSI}${rows}F`) })

/** @internal */
export const cursorHide: Ansi.Ansi = make({ commands: ReadonlyArray.of(`${CSI}?25l`) })

/** @internal */
export const cursorShow: Ansi.Ansi = make({ commands: ReadonlyArray.of(`${CSI}?25h`) })

/** @internal */
export const eraseLines = (rows: number): Ansi.Ansi => {
  let command = ""
  for (let i = 0; i < rows; i++) {
    command += `${CSI}2K` + (i < rows - 1 ? `${CSI}1A` : "")
  }
  if (rows > 0) {
    command += `${CSI}G`
  }
  return make({ commands: ReadonlyArray.of(command) })
}

/** @internal */
export const eraseEndLine: Ansi.Ansi = make({ commands: ReadonlyArray.of(`${CSI}K`) })

/** @internal */
export const eraseStartLine: Ansi.Ansi = make({ commands: ReadonlyArray.of(`${CSI}1K`) })

/** @internal */
export const eraseLine: Ansi.Ansi = make({ commands: ReadonlyArray.of(`${CSI}2K`) })

/** @internal */
export const eraseDown: Ansi.Ansi = make({ commands: ReadonlyArray.of(`${CSI}J`) })

/** @internal */
export const eraseUp: Ansi.Ansi = make({ commands: ReadonlyArray.of(`${CSI}1J`) })

/** @internal */
export const eraseScreen: Ansi.Ansi = make({ commands: ReadonlyArray.of(`${CSI}2J`) })

// -----------------------------------------------------------------------------
// Destructors
// -----------------------------------------------------------------------------

/** @internal */
export const stringify = (self: Ansi.Ansi): string => stringifyInternal(self as AnsiImpl)

// -----------------------------------------------------------------------------
// Combinators
// -----------------------------------------------------------------------------

/** @internal */
export const combine = dual<
  (that: Ansi.Ansi) => (self: Ansi.Ansi) => Ansi.Ansi,
  (self: Ansi.Ansi, that: Ansi.Ansi) => Ansi.Ansi
>(2, (self, that) => combineInternal(self as AnsiImpl, that as AnsiImpl))

// -----------------------------------------------------------------------------
// Internal
// -----------------------------------------------------------------------------

const combineInternal = (self: AnsiImpl, that: AnsiImpl): Ansi.Ansi => AnsiSemigroup.combine(self, that)

const stringifyInternal = (self: AnsiImpl): string => {
  const styles = Style.toCode(
    ReadonlyArray.getSomes([
      Option.some(Style.reset),
      self.foreground,
      self.background,
      self.bold,
      self.italic,
      self.strikethrough,
      self.underline
    ])
  )
  const commandSequence = ReadonlyArray.join(self.commands, "")
  return `${CSI}${styles}${commandSequence}`
}
