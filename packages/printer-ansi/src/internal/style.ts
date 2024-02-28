/**
 * This module contains the definition of a data structure meant to represent
 * the control sequence introducer `CSI n m`, also known as the Select Graphic
 * Rendition (SGR), where `n` is used to control terminal display attributes.
 *
 * Several SGR display attributes can be set in the same CSI sequence, separated
 * by semicolons.
 *
 * Each display attribute remains in effect in the terminal until a following
 * occurrence of SGR resets it.
 *
 * The SGR display attributes available in this module are **not** meant to be
 * exhaustive but instead are meant to provide the most common and
 * well-supported SGR display attributes (with a few exceptions).
 */
import { Match } from "effect"
import type * as Color from "../Color.js"
import * as color from "./color.js"

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

/**
 * Represents the the control sequence introducer `CSI n m`, also called the
 * Select Graphic Rendition (SGR), which controls terminal display attributes.
 *
 * @internal
 */
export type Style =
  | Reset
  | Bold
  | Faint
  | Italic
  | Underline
  | Strikethrough
  | Invert
  | SetColor
// |  Foreground
//  | Background

/**
 * Resets all SGR attributes to their default values.
 *
 * @internal
 */
export interface Reset {
  readonly _tag: "Reset"
}

/**
 * Controls whether the text displayed in the terminal is bold.
 *
 * @internal
 */
export interface Bold {
  readonly _tag: "Bold"
  readonly bold: boolean
}

/**
 * Controls whether the text displayed in the terminal is faint.
 *
 * @internal
 */
export interface Faint {
  readonly _tag: "Faint"
  readonly state: boolean
}

/**
 * Controls whether the text displayed in the terminal is inverted.
 *
 * @internal
 */
export interface Invert {
  readonly _tag: "Invert"
  readonly state: boolean
}

/**
 * Controls the color of the text displayed in the terminal.
 *
 * @internal
 */
export interface SetColor {
  readonly _tag: "SetColor"
  readonly color: Color.Color
  readonly vivid: boolean
  readonly layer: Style.Layer
}

/**
 * Controls whether the text displayed in the terminal is italicized.
 *
 * **NOTE**: not widely supported.
 *
 * @internal
 */
export interface Italic {
  readonly _tag: "Italic"
  readonly italicized: boolean
}

/**
 * Controls whether the text displayed in the terminal has a strikethrough.
 *
 * @internal
 */
export interface Strikethrough {
  readonly _tag: "Strikethrough"
  readonly strikethrough: boolean
}

/**
 * Controls whether the text displayed in the terminal is underlined.
 *
 * @internal
 */
export interface Underline {
  readonly _tag: "Underline"
  readonly underlined: boolean
}

/** @internal */
export declare namespace Style {
  /** @internal */
  export type Layer = "foreground" | "background"
}

// -----------------------------------------------------------------------------
// Constructors
// -----------------------------------------------------------------------------

/** @internal */
export const reset: Style = { _tag: "Reset" }

/** @internal */
export const setBold = (bold: boolean): Style => ({
  _tag: "Bold",
  bold
})

/** @internal */
export const setColor = (color: Color.Color, vivid: boolean, layer: Style.Layer): Style => ({
  _tag: "SetColor",
  color,
  vivid,
  layer
})

/** @internal */
export const setItalicized = (italicized: boolean): Style => ({
  _tag: "Italic",
  italicized
})

/** @internal */
export const setStrikethrough = (strikethrough: boolean): Style => ({
  _tag: "Strikethrough",
  strikethrough
})

/** @internal */
export const setUnderlined = (underlined: boolean): Style => ({
  _tag: "Underline",
  underlined
})

// -----------------------------------------------------------------------------
// Destructors
// -----------------------------------------------------------------------------

/** @internal */
const singleToCode = (self: Style): number =>
  Match.value(self).pipe(
    Match.tag("Reset", () => 0),
    Match.tag("Bold", (self) => self.bold ? 1 : 22),
    Match.tag("Faint", (self) => self.state ? 2 : 22),
    Match.tag("Italic", (self) => self.italicized ? 3 : 23),
    Match.tag("Underline", (self) => self.underlined ? 4 : 24),
    Match.tag("Strikethrough", (self) => self.strikethrough ? 9 : 29),
    Match.tag("Invert", (self) => self.state ? 7 : 27),
    Match.tag("SetColor", (self) =>
      Match.value(self.layer).pipe(
        Match.when("foreground", () => self.vivid ? 90 + color.toCode(self.color) : 30 + color.toCode(self.color)),
        Match.when("background", () => self.vivid ? 100 + color.toCode(self.color) : 40 + color.toCode(self.color)),
        Match.exhaustive
      )),
    Match.exhaustive
  )

const multiToCode = (sgrs: Iterable<Style>): string => Array.from(sgrs).map(singleToCode).join(";")

/** @internal */
export const toCode = (sgrs: Iterable<Style>): string => multiToCode(sgrs).concat("m")
