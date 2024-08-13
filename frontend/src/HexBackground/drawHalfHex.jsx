// Function to draw only half of the hexagon
function drawHalfHex(ctx, x, y, size, color) {
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
  ctx.lineWidth = 0.1
  ctx.stroke()
}

export default drawHalfHex
