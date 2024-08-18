import { memo, useRef, useLayoutEffect } from 'react'
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
  const offscreenCanvasRef = useRef(null)
  const { transform, width, height, d3Zoom } = useStore(
    s => ({
      transform: s.transform,
      width: s.width,
      height: s.height,
      d3Zoom: s.d3Zoom,
    }),
    shallow
  )

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const offscreenCanvas = offscreenCanvasRef.current

    // Check if canvas elements exist and have dimensions
    if (canvas && offscreenCanvas && canvas.width > 0 && canvas.height > 0) {
      const render = () => {
        // Ensure offscreen canvas dimensions match main canvas
        offscreenCanvas.width = canvas.width
        offscreenCanvas.height = canvas.height

        const ctx = canvas.getContext('2d')
        const offscreenCtx = offscreenCanvas.getContext('2d')

        offscreenCtx.clearRect(
          0,
          0,
          offscreenCanvas.width,
          offscreenCanvas.height
        )

        if (transform) {
          offscreenCtx.save()
          offscreenCtx.translate(transform[0], transform[1])
          offscreenCtx.scale(transform[2], transform[2])
        }

        const zoomOrigin = d3Zoom?.transform().translate
        const hexWidth = size * Math.sqrt(3)
        const hexHeight = size * 2
        const hexVerticalSpacing = hexHeight * 0.75

        const startX = zoomOrigin ? -zoomOrigin[0] : 0
        const startY = zoomOrigin ? -zoomOrigin[1] : 0

        const buffer = 5
        const overflowBuffer = parentScale * buffer

        const rows = Math.ceil(height / hexVerticalSpacing) + overflowBuffer
        const cols = Math.ceil(width / hexWidth) + overflowBuffer

        for (let row = -overflowBuffer; row < rows; row++) {
          for (let col = -overflowBuffer; col < cols; col++) {
            const x = col * hexWidth + (row % 2) * (hexWidth / 2) + startX
            const y = row * hexVerticalSpacing + hexHeight / 2 + startY

            drawHalfHex(offscreenCtx, x, y, size, color, 0.3)
          }
        }

        // Draw parent hexagons
        const parentHexWidth = hexWidth * parentScale
        const parentHexHeight = hexHeight * parentScale
        const parentHexVerticalSpacing = parentHexHeight * 0.75
        const parentRows = Math.ceil(rows / parentScale) + buffer
        const parentCols = Math.ceil(cols / parentScale) + buffer

        for (let row = -buffer; row < parentRows; row++) {
          for (let col = -buffer; col < parentCols; col++) {
            const x =
              col * parentHexWidth + (row % 2) * (parentHexWidth / 2) + startX
            const y =
              row * parentHexVerticalSpacing + parentHexHeight / 2 + startY

            drawHalfHex(offscreenCtx, x, y, size * parentScale, parentColor, 2)
          }
        }

        if (transform) {
          offscreenCtx.restore()
        }

        // Copy from offscreen canvas to visible canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(offscreenCanvas, 0, 0)
      }

      render() // Initial render

      const resizeObserver = new ResizeObserver(render)
      resizeObserver.observe(canvas)

      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [transform, width, height, d3Zoom, size, color, parentColor, parentScale])

  return (
    <>
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
      <canvas
        ref={offscreenCanvasRef}
        style={{ display: 'none' }}
        width={width}
        height={height}
      />
    </>
  )
}

export default memo(HexBackground)
