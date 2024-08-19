import {
  Hex,
  addHex,
  subtractHex,
  scaleHex,
  rotateLeftHex,
  rotateRightHex,
  hexDirection,
  hexNeighbor,
  hexDiagonalNeighbor,
  hexLength,
  hexDistance,
  roundHex,
  linearlyInterpolate,
  hexLineDraw,
  OffsetCoord,
  qOffsetFromCube,
  qOffsetToCube,
  rOffsetFromCube,
  rOffsetToCube,
  qDoubledFromCube,
  qDoubledToCube,
  rDoubledFromCube,
  rDoubledToCube,
  Orientation,
  Layout,
  hexToPixel,
  pixelToHex,
} from './hex.js'

describe('Hexagonal Grid Functions', () => {
  it('should add two hexagons correctly', () => {
    expect(addHex(Hex(1, -3, 2), Hex(3, -7, 4))).toEqual(Hex(4, -10, 6))
  })

  it('should subtract two hexagons correctly', () => {
    expect(subtractHex(Hex(1, -3, 2), Hex(3, -7, 4))).toEqual(Hex(-2, 4, -2))
  })

  it('should scale a hexagon correctly', () => {
    expect(scaleHex(Hex(1, -3, 2), 2)).toEqual(Hex(2, -6, 4))
  })

  it('should rotate a hexagon left correctly', () => {
    expect(rotateLeftHex(Hex(1, -3, 2))).toEqual(Hex(-2, -1, 3))
  })

  it('should rotate a hexagon right correctly', () => {
    expect(rotateRightHex(Hex(1, -3, 2))).toEqual(Hex(3, -2, -1))
  })

  it('should return the correct hex direction', () => {
    expect(hexDirection(2)).toEqual(Hex(0, -1, 1))
  })

  it('should return the correct hex neighbor', () => {
    expect(hexNeighbor(Hex(1, -2, 1), 2)).toEqual(Hex(1, -3, 2))
  })

  it('should return the correct hex diagonal neighbor', () => {
    expect(hexDiagonalNeighbor(Hex(1, -2, 1), 3)).toEqual(Hex(-1, -1, 2))
  })

  it('should return the correct hex length', () => {
    expect(hexLength(Hex(3, -7, 4))).toBe(7)
  })

  it('should return the correct hex distance', () => {
    expect(hexDistance(Hex(3, -7, 4), Hex(0, 0, 0))).toBe(7)
  })

  it('should round a hex correctly', () => {
    expect(
      roundHex(linearlyInterpolate(Hex(0, 0, 0), Hex(10, -20, 10), 0.5))
    ).toEqual(Hex(5, -10, 5))
  })

  it('should draw a line of hexes correctly', () => {
    const expectedLine = [
      Hex(0, 0, -0),
      Hex(0, -1, 1),
      Hex(0, -2, 2),
      Hex(1, -3, 2),
      Hex(1, -4, 3),
      Hex(1, -5, 4),
    ]
    expect(hexLineDraw(Hex(0, 0, 0), Hex(1, -5, 4))).toEqual(expectedLine)
  })

  it('should convert from cube to qOffset and back correctly', () => {
    const hex = Hex(3, 4, -7)
    expect(
      qOffsetToCube(OffsetCoord.EVEN, qOffsetFromCube(OffsetCoord.EVEN, hex))
    ).toEqual(hex)
  })

  it('should convert from cube to rOffset and back correctly', () => {
    const hex = Hex(3, 4, -7)
    expect(
      rOffsetToCube(OffsetCoord.EVEN, rOffsetFromCube(OffsetCoord.EVEN, hex))
    ).toEqual(hex)
  })

  it('should convert from cube to qDoubled and back correctly', () => {
    const hex = Hex(3, 4, -7)
    expect(qDoubledToCube(qDoubledFromCube(hex))).toEqual(hex)
  })

  it('should convert from cube to rDoubled and back correctly', () => {
    const hex = Hex(3, 4, -7)
    expect(rDoubledToCube(rDoubledFromCube(hex))).toEqual(hex)
  })

  it('should convert from hex to pixel and back correctly (flat)', () => {
    const hex = Hex(3, 4, -7)
    const layout = Layout(Orientation.flat, { x: 10, y: 15 }, { x: 35, y: 71 })
    expect(roundHex(pixelToHex(layout, hexToPixel(layout, hex)))).toEqual(hex)
  })

  it('should convert from hex to pixel and back correctly (pointy)', () => {
    const hex = Hex(3, 4, -7)
    const layout = Layout(
      Orientation.pointy,
      { x: 10, y: 15 },
      { x: 35, y: 71 }
    )
    expect(roundHex(pixelToHex(layout, hexToPixel(layout, hex)))).toEqual(hex)
  })
})
