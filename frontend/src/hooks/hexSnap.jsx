import { gridSize } from '../settings'

/**
 * Snaps a given position to the nearest hexagonal grid point.
 * @param {Object} position - The position to snap to the grid, with x and y coordinates.
 * @returns {Object} The snapped position, with x and y coordinates.
 */ const hexSnap = position => {
  // Width of a single hexagon in the grid
  const hexWidth = gridSize * Math.sqrt(3)

  // Vertical spacing between rows of hexagons
  const hexVerticalSpacing = gridSize * 2 * 0.75

  // Get column by offsetting the x-coordinate based on the y-coordinate
  const col = Math.round(
    (position.x - (position.y % (2 * hexVerticalSpacing)) / 2) / hexWidth
  )

  // Get row by offsetting the y-coordinate to account for the vertical spacing
  const row = Math.round(
    (position.y - hexVerticalSpacing * 0.5) / hexVerticalSpacing
  )

  // Snapped x-coordinate based on the column and row
  // (rows alternate between full and half hexagons, hence the modulo)
  const x = col * hexWidth + (row % 2) * (hexWidth / 2)

  // Snapped y-coordinate based on the row
  // (hexagons are taller than they are wide, hence the multiplication)
  const y = row * hexVerticalSpacing + hexVerticalSpacing * (2 / 3)

  // Return the snapped position
  return { x, y }
}

// Export the function as the default export
export default hexSnap
