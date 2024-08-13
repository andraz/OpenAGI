import { memo, useRef, useEffect } from 'react'
import { useStore } from '@xyflow/react'
import { shallow } from 'zustand/shallow'
import drawHalfHex from './drawHalfHex.jsx'

const HexBackground = ({ size = 60, color = 'hwb(222 5% 5%)' }) => {
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
      const rows = Math.ceil(height / hexVerticalSpacing) + 25 // Add extra rows for buffer
      const cols = Math.ceil(width / hexWidth) + 25 // Add extra cols for buffer

      // Start with negative offset for buffer
      for (let row = -25; row < rows; row++) {
        for (let col = -25; col < cols; col++) {
          const x = col * hexWidth + (row % 2) * (hexWidth / 2) + startX
          const y = row * hexVerticalSpacing + startY
          drawHalfHex(ctx, x, y, size, color)
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
  }, [transform, width, height, d3Zoom, size, color])

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
        opacity: 0.9,
        background: color.slice(0, -1) + '/ 11%)',
      }}
      width={width}
      height={height}
    />
  )
}

export default memo(HexBackground)
