/**
 * Draws a half of a hexagon on a 2D canvas context.
 *
 * @param {CanvasRenderingContext2D} ctx - The 2D canvas context to draw on.
 * @param {number} x - The x-coordinate of the center of the hexagon.
 * @param {number} y - The y-coordinate of the center of the hexagon.
 * @param {number} size - The size of the hexagon.
 * @param {string} color - The color of the hexagon's outline.
 * @param {number} [lineWidth=0.3] - The width of the hexagon's outline.
 */
function drawHalfHex(ctx, x, y, size, color, lineWidth = 0.3) {
  ctx.beginPath()

  // Start line at bottom center
  ctx.moveTo(x, y + size)

  // Draw bottom left edge
  ctx.lineTo(x - (size * Math.sqrt(3)) / 2, y + size / 2)

  // Draw left edge
  ctx.lineTo(x - (size * Math.sqrt(3)) / 2, y - size / 2)

  // Draw top left edge
  ctx.lineTo(x, y - size)

  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.stroke()
}

export default drawHalfHex
