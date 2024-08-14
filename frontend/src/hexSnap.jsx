import { gridSize } from './settings'

const hexSnap = position => {
  const hexWidth = gridSize * Math.sqrt(3)
  const hexVerticalSpacing = gridSize * 2 * 0.75

  // Adjust the horizontal calculation to align with hexagon centers:
  const col = Math.round(
    (position.x - hexWidth - (position.y % (2 * hexVerticalSpacing)) / 2) /
      hexWidth
  )

  const row = Math.round(
    (position.y - hexVerticalSpacing * 0.5) / hexVerticalSpacing
  )

  const x = col * hexWidth + (row % 2) * (hexWidth / 2) + hexWidth / 2 // Center x coordinate
  const y = row * hexVerticalSpacing

  // Offset the x and y coordinates by half the node's width and height:
  const xOffset = hexWidth / 2
  const yOffset = hexVerticalSpacing * 0.3333 // Height of the hexagon

  return { x: x + xOffset, y: y + yOffset }
}

export default hexSnap
