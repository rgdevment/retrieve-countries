/**
 * Enums for controlling country endpoint responses.
 *
 * - `ExcludeOption` — controls hierarchy depth (which children to omit).
 * - `ResponseType` — controls field-level detail (full vs. dropdown).
 */

export enum ExcludeOption {
  /** Omit cities from state children. Returns Country → States. */
  CITIES = 'cities',
  /** Omit states (and therefore cities). Returns Country only. */
  STATES = 'states',
}

export enum ResponseType {
  /** Minimal payload: id, name, iso2, emoji. Ideal for dropdowns. */
  SIMPLE = 'simple',
  /** Full payload with all fields (default). */
  FULL = 'full',
}
