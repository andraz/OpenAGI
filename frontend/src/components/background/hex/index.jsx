import { memo, useRef, useEffect } from 'react'
import { useStore } from '@xyflow/react'
import { shallow } from 'zustand/shallow'
import drawHalfHex from './drawHalfHex.jsx'

const HexBackground = ({
  size = 60,
  color = 'hwb(222 22% 5%)',
  parentColor = 'hwb(30 0% 70%)',
  parentScale = 7,
}) => {
  const canvasRef = useRef(null)
  const { transform, width, height, d3Zoom } = useStore(
    s => ({
      transform: s.transform,
      width: s.width,
      height: s.height,
      d3Zoom: s.d3Zoom,
    }),
    shallow
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (transform) {
        ctx.save()
        ctx.translate(transform[0], transform[1])
        ctx.scale(transform[2], transform[2])
      }

      const zoomOrigin = d3Zoom?.transform().translate
      const hexWidth = size * Math.sqrt(3)
      const hexHeight = size * 2
      const hexVerticalSpacing = hexHeight * 0.75

      const startX = zoomOrigin ? -zoomOrigin[0] : 0
      const startY = zoomOrigin ? -zoomOrigin[1] : 0

      // Calculate amount of buffer to allow for scrolling off screen
      const buffer = 5
      const overflowBuffer = parentScale * buffer

      const rows = Math.ceil(height / hexVerticalSpacing) + overflowBuffer // Add extra rows for buffer
      const cols = Math.ceil(width / hexWidth) + overflowBuffer // Add extra cols for buffer

      // Start with negative offset for buffer
      for (let row = -overflowBuffer; row < rows; row++) {
        for (let col = -overflowBuffer; col < cols; col++) {
          const x = col * hexWidth + (row % 2) * (hexWidth / 2) + startX
          const y = row * hexVerticalSpacing + hexHeight / 2 + startY

          drawHalfHex(ctx, x, y, size, color, 0.3)
        }
      }

      // Draw parent hexagons
      const parentHexWidth = hexWidth * parentScale
      const parentHexHeight = hexHeight * parentScale
      const parentHexVerticalSpacing = parentHexHeight * 0.75
      const parentRows = Math.ceil(rows / parentScale) + buffer
      const parentCols = Math.ceil(cols / parentScale) + buffer

      // Start with negative offset for buffer
      for (let row = -buffer; row < parentRows; row++) {
        for (let col = -buffer; col < parentCols; col++) {
          const x =
            col * parentHexWidth + (row % 2) * (parentHexWidth / 2) + startX
          const y =
            row * parentHexVerticalSpacing + parentHexHeight / 2 + startY

          drawHalfHex(ctx, x, y, size * parentScale, parentColor, 2)
        }
      }

      if (transform) {
        ctx.restore()
      }
    }

    render() // Initial render

    // Set up resize observer
    const resizeObserver = new ResizeObserver(render)
    resizeObserver.observe(canvas)

    return () => {
      resizeObserver.disconnect()
    }
  }, [transform, width, height, d3Zoom, size, color, parentColor, parentScale])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: -1,
        opacity: 0.8,
        background: color.slice(0, -1) + '/ 11%)',
      }}
      width={width}
      height={height}
    />
  )
}

export default memo(HexBackground)
