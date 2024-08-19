/**
 * Represents a point in 2D space.
 *
 * @typedef {Object} Point
 * @property {number} x The x-coordinate of the point.
 * @property {number} y The y-coordinate of the point.
 */
export const Point = (x, y) => ({ x, y })

/**
 * Represents a hexagon in cube coordinates.
 *
 * @typedef {Object} Hex
 * @property {number} q The q-coordinate of the hexagon.
 * @property {number} r The r-coordinate of the hexagon.
 * @property {number} s The s-coordinate of the hexagon.
 */
export const Hex = (q, r, s) => {
  if (Math.round(q + r + s) !== 0) {
    throw new Error('q + r + s must be 0')
  }
  return { q, r, s }
}

/**
 * Adds two hexagons together, element-wise.
 *
 * @param {Hex} a The first hexagon.
 * @param {Hex} b The second hexagon.
 * @returns {Hex} The sum of the two hexagons.
 */
export const addHex = (a, b) => Hex(a.q + b.q, a.r + b.r, a.s + b.s)

/**
 * Subtracts one hexagon from another, element-wise.
 *
 * @param {Hex} a The first hexagon.
 * @param {Hex} b The second hexagon.
 * @returns {Hex} The difference of the two hexagons.
 */
export const subtractHex = (a, b) => Hex(a.q - b.q, a.r - b.r, a.s - b.s)

/**
 * Scales a hexagon by a scalar value.
 *
 * @param {Hex} a The hexagon to scale.
 * @param {number} k The scalar value.
 * @returns {Hex} The scaled hexagon.
 */
export const scaleHex = (a, k) => Hex(a.q * k, a.r * k, a.s * k)

/**
 * Rotates a hexagon to the left by one position.
 *
 * @param {Hex} a The hexagon to rotate.
 * @returns {Hex} The rotated hexagon.
 */
export const rotateLeftHex = a => Hex(-a.s, -a.q, -a.r)

/**
 * Rotates a hexagon to the right by one position.
 *
 * @param {Hex} a The hexagon to rotate.
 * @returns {Hex} The rotated hexagon.
 */
export const rotateRightHex = a => Hex(-a.r, -a.s, -a.q)

/**
 * Returns the six directions of a hexagon.
 *
 * @returns {Hex[]} An array of six hexagons representing the directions.
 */
export const hexDirections = [
  Hex(1, 0, -1),
  Hex(1, -1, 0),
  Hex(0, -1, 1),
  Hex(-1, 0, 1),
  Hex(-1, 1, 0),
  Hex(0, 1, -1),
]

/**
 * Returns the direction of a hexagon at a given index.
 *
 * @param {number} direction The index of the direction.
 * @returns {Hex} The hexagon representing the direction.
 */
export const hexDirection = direction => hexDirections[direction]

/**
 * Returns the neighbor of a hexagon in a given direction.
 *
 * @param {Hex} a The hexagon to get the neighbor of.
 * @param {number} direction The index of the direction.
 * @returns {Hex} The neighbor hexagon.
 */
export const hexNeighbor = (a, direction) => addHex(a, hexDirection(direction))

/**
 * Returns the six diagonals of a hexagon.
 *
 * @returns {Hex[]} An array of six hexagons representing the diagonals.
 */
export const hexDiagonals = [
  Hex(2, -1, -1),
  Hex(1, -2, 1),
  Hex(-1, -1, 2),
  Hex(-2, 1, 1),
  Hex(-1, 2, -1),
  Hex(1, 1, -2),
]

/**
 * Returns the diagonal neighbor of a hexagon in a given direction.
 *
 * @param {Hex} a The hexagon to get the diagonal neighbor of.
 * @param {number} direction The index of the direction.
 * @returns {Hex} The diagonal neighbor hexagon.
 */
export const hexDiagonalNeighbor = (a, direction) =>
  addHex(a, hexDiagonals[direction])

/**
 * Returns the length of a hexagon.
 *
 * @param {Hex} a The hexagon to get the length of.
 * @returns {number} The length of the hexagon.
 */
export const hexLength = a =>
  (Math.abs(a.q) + Math.abs(a.r) + Math.abs(a.s)) / 2

/**
 * Returns the distance between two hexagons.
 *
 * @param {Hex} a The first hexagon.
 * @param {Hex} b The second hexagon.
 * @returns {number} The distance between the two hexagons.
 */
export const hexDistance = (a, b) => hexLength(subtractHex(a, b))

/**
 * Rounds a hexagon to the nearest integer coordinates.
 *
 * @param {Hex} a The hexagon to round.
 * @returns {Hex} The rounded hexagon.
 */
export const roundHex = a => {
  let qi = Math.round(a.q)
  let ri = Math.round(a.r)
  let si = Math.round(a.s)
  const qDiff = Math.abs(qi - a.q)
  const rDiff = Math.abs(ri - a.r)
  const sDiff = Math.abs(si - a.s)
  if (qDiff > rDiff && qDiff > sDiff) {
    qi = -ri - si
  } else if (rDiff > sDiff) {
    ri = -qi - si
  } else {
    si = -qi - ri
  }
  return Hex(qi, ri, si)
}

/**
 * Linearly interpolates between two hexagons.
 *
 * @param {Hex} a The first hexagon.
 * @param {Hex} b The second hexagon.
 * @param {number} t The interpolation factor.
 * @returns {Hex} The interpolated hexagon.
 */
export const linearlyInterpolate = (a, b, t) =>
  Hex(a.q * (1 - t) + b.q * t, a.r * (1 - t) + b.r * t, a.s * (1 - t) + b.s * t)

/**
 * Draws a line of hexagons between two hexagons.
 *
 * @param {Hex} a The first hexagon.
 * @param {Hex} b The second hexagon.
 * @returns {Hex[]} An array of hexagons representing the line.
 */
export const hexLineDraw = (a, b) => {
  const n = hexDistance(a, b)
  const aNudge = Hex(a.q + 1e-6, a.r + 1e-6, a.s - 2e-6)
  const bNudge = Hex(b.q + 1e-6, b.r + 1e-6, b.s - 2e-6)
  const results = []
  const step = 1 / Math.max(n, 1)
  for (let i = 0; i <= n; i++) {
    results.push(roundHex(linearlyInterpolate(aNudge, bNudge, step * i)))
  }
  return results
}

/**
 * Represents an offset coordinate.
 *
 * @typedef {Object} OffsetCoord
 * @property {number} col The column coordinate.
 * @property {number} row The row coordinate.
 */
export const OffsetCoord = (col, row) => ({ col, row })

/**
 * Constant representing an even offset.
 */
OffsetCoord.EVEN = 1

/**
 * Constant representing an odd offset.
 */
OffsetCoord.ODD = -1

/**
 * Converts a hexagon from cube coordinates to offset coordinates using the q-axis offset.
 *
 * @param {number} offset The offset type (EVEN or ODD).
 * @param {Hex} Hex The hexagon to convert.
 * @returns {OffsetCoord} The offset coordinates.
 */
export const qOffsetFromCube = (offset, Hex) => {
  const col = Hex.q
  const row = Hex.r + (Hex.q + offset * (Hex.q & 1)) / 2
  if (offset !== OffsetCoord.EVEN && offset !== OffsetCoord.ODD) {
    throw 'offset must be EVEN (+1) or ODD (-1)'
  }
  return OffsetCoord(col, row)
}

/**
 * Converts a hexagon from offset coordinates to cube coordinates using the q-axis offset.
 *
 * @param {number} offset The offset type (EVEN or ODD).
 * @param {OffsetCoord} offsetCoord The offset coordinates to convert.
 * @returns {Hex} The hexagon in cube coordinates.
 */
export const qOffsetToCube = (offset, offsetCoord) => {
  const q = offsetCoord.col
  const r =
    offsetCoord.row - (offsetCoord.col + offset * (offsetCoord.col & 1)) / 2
  const s = -q - r
  if (offset !== OffsetCoord.EVEN && offset !== OffsetCoord.ODD) {
    throw 'offset must be EVEN (+1) or ODD (-1)'
  }
  return Hex(q, r, s)
}

/**
 * Converts a hexagon from cube coordinates to offset coordinates using the r-axis offset.
 *
 * @param {number} offset The offset type (EVEN or ODD).
 * @param {Hex} Hex The hexagon to convert.
 * @returns {OffsetCoord} The offset coordinates.
 */
export const rOffsetFromCube = (offset, Hex) => {
  const col = Hex.q + (Hex.r + offset * (Hex.r & 1)) / 2
  const row = Hex.r
  if (offset !== OffsetCoord.EVEN && offset !== OffsetCoord.ODD) {
    throw 'offset must be EVEN (+1) or ODD (-1)'
  }
  return OffsetCoord(col, row)
}

/**
 * Converts a hexagon from offset coordinates to cube coordinates using the r-axis offset.
 *
 * @param {number} offset The offset type (EVEN or ODD).
 * @param {OffsetCoord} offsetCoord The offset coordinates to convert.
 * @returns {Hex} The hexagon in cube coordinates.
 */
export const rOffsetToCube = (offset, offsetCoord) => {
  const q =
    offsetCoord.col - (offsetCoord.row + offset * (offsetCoord.row & 1)) / 2
  const r = offsetCoord.row
  const s = -q - r
  if (offset !== OffsetCoord.EVEN && offset !== OffsetCoord.ODD) {
    throw 'offset must be EVEN (+1) or ODD (-1)'
  }
  return Hex(q, r, s)
}

/**
 * Represents a doubled coordinate.
 *
 * @typedef {Object} DoubledCoord
 * @property {number} col The column coordinate.
 * @property {number} row The row coordinate.
 */
export const DoubledCoord = (col, row) => ({ col, row })

/**
 * Converts a hexagon from cube coordinates to doubled coordinates using the q-axis.
 *
 * @param {Hex} Hex The hexagon to convert.
 * @returns {DoubledCoord} The doubled coordinates.
 */
export const qDoubledFromCube = Hex => {
  const col = Hex.q
  const row = 2 * Hex.r + Hex.q
  return DoubledCoord(col, row)
}

/**
 * Converts a hexagon from doubled coordinates to cube coordinates using the q-axis.
 *
 * @param {DoubledCoord} doubledCoord The doubled coordinates to convert.
 * @returns {Hex} The hexagon in cube coordinates.
 */
export const qDoubledToCube = doubledCoord => {
  const q = doubledCoord.col
  const r = (doubledCoord.row - doubledCoord.col) / 2
  const s = -q - r
  return Hex(q, r, s)
}

/**
 * Converts a hexagon from cube coordinates to doubled coordinates using the r-axis.
 *
 * @param {Hex} Hex The hexagon to convert.
 * @returns {DoubledCoord} The doubled coordinates.
 */
export const rDoubledFromCube = Hex => {
  const col = 2 * Hex.q + Hex.r
  const row = Hex.r
  return DoubledCoord(col, row)
}

/**
 * Converts a hexagon from doubled coordinates to cube coordinates using the r-axis.
 *
 * @param {DoubledCoord} doubledCoord The doubled coordinates to convert.
 * @returns {Hex} The hexagon in cube coordinates.
 */
export const rDoubledToCube = doubledCoord => {
  const q = (doubledCoord.col - doubledCoord.row) / 2
  const r = doubledCoord.row
  const s = -q - r
  return Hex(q, r, s)
}

/**
 * Represents an orientation for hexagonal grids.
 *
 * @typedef {Object} Orientation
 * @property {number} f0 Forward matrix coefficient 0.
 * @property {number} f1 Forward matrix coefficient 1.
 * @property {number} f2 Forward matrix coefficient 2.
 * @property {number} f3 Forward matrix coefficient 3.
 * @property {number} b0 Backward matrix coefficient 0.
 * @property {number} b1 Backward matrix coefficient 1.
 * @property {number} b2 Backward matrix coefficient 2.
 * @property {number} b3 Backward matrix coefficient 3.
 * @property {number} start_angle The starting angle of the orientation.
 */
export const Orientation = (f0, f1, f2, f3, b0, b1, b2, b3, start_angle) => ({
  f0,
  f1,
  f2,
  f3,
  b0,
  b1,
  b2,
  b3,
  start_angle,
})

/**
 * Pointy orientation for hexagonal grids.
 */
Orientation.pointy = Orientation(
  Math.sqrt(3.0),
  Math.sqrt(3.0) / 2.0,
  0.0,
  3.0 / 2.0,
  Math.sqrt(3.0) / 3.0,
  -1.0 / 3.0,
  0.0,
  2.0 / 3.0,
  0.5
)

/**
 * Flat orientation for hexagonal grids.
 */
Orientation.flat = Orientation(
  3.0 / 2.0,
  0.0,
  Math.sqrt(3.0) / 2.0,
  Math.sqrt(3.0),
  2.0 / 3.0,
  0.0,
  -1.0 / 3.0,
  Math.sqrt(3.0) / 3.0,
  0.0
)

/**
 * Represents a layout for hexagonal grids.
 *
 * @typedef {Object} Layout
 * @property {Orientation} orientation The orientation of the layout.
 * @property {Point} size The size of each hexagon.
 * @property {Point} origin The origin of the layout.
 */
export const Layout = (orientation, size, origin) => ({
  orientation,
  size,
  origin,
})

/**
 * Converts a hexagon from cube coordinates to pixel coordinates.
 *
 * @param {Layout} layout The layout to use for conversion.
 * @param {Hex} h The hexagon to convert.
 * @returns {Point} The pixel coordinates of the hexagon.
 */
export const hexToPixel = (layout, h) => {
  const M = layout.orientation
  const size = layout.size
  const origin = layout.origin
  const x = (M.f0 * h.q + M.f1 * h.r) * size.x
  const y = (M.f2 * h.q + M.f3 * h.r) * size.y
  return Point(x + origin.x, y + origin.y)
}

/**
 * Converts a point from pixel coordinates to cube coordinates.
 *
 * @param {Layout} layout The layout to use for conversion.
 * @param {Point} p The point to convert.
 * @returns {Hex} The hexagon in cube coordinates.
 */
export const pixelToHex = (layout, p) => {
  const M = layout.orientation
  const size = layout.size
  const origin = layout.origin
  const pt = Point((p.x - origin.x) / size.x, (p.y - origin.y) / size.y)
  const q = M.b0 * pt.x + M.b1 * pt.y
  const r = M.b2 * pt.x + M.b3 * pt.y
  return Hex(q, r, -q - r)
}

/**
 * Calculates the offset of a hexagon corner from its center.
 *
 * @param {Layout} layout The layout to use for calculation.
 * @param {number} corner The index of the corner (0-5).
 * @returns {Point} The offset of the corner.
 */
export const hexCornerOffset = (layout, corner) => {
  const M = layout.orientation
  const size = layout.size
  const angle = (2.0 * Math.PI * (M.start_angle - corner)) / 6.0
  return Point(size.x * Math.cos(angle), size.y * Math.sin(angle))
}

/**
 * Returns the pixel coordinates of the corners of a hexagon.
 *
 * @param {Layout} layout The layout to use for calculation.
 * @param {Hex} Hex The hexagon to get the corners of.
 * @returns {Point[]} An array of points representing the corners of the hexagon.
 */
export const polygonCorners = (layout, Hex) => {
  const corners = []
  const center = hexToPixel(layout, Hex)
  for (let i = 0; i < 6; i++) {
    const offset = hexCornerOffset(layout, i)
    corners.push(Point(center.x + offset.x, center.y + offset.y))
  }
  return corners
}
