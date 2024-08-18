import { memo, useRef, useEffect } from 'react'
import { useStore } from '@xyflow/react'
import { shallow } from 'zustand/shallow'
import drawHalfHex from './drawHalfHex.jsx'

const HexBackground = ({
  size = 60,
  color = 'hwb(240 22% 5%)',
  parentColor = 'hwb(0 0% 60%)',
  parentScale = 7,
  grandparentColor = 'hwb(120 0% 55%)',
  grandparentScale = parentScale * 7,
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

  useEffect(() => {
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

        // Calculate line weights based on zoom level
        const scaleFactor = transform ? transform[2] : 1
        const lineWeightA = 0.3 * scaleFactor
        const lineWeightB = 3 * scaleFactor
        const lineWeightC = 2 / scaleFactor

        const zoomOrigin = d3Zoom?.transform().translate
        const hexWidth = size * Math.sqrt(3)
        const hexHeight = size * 2
        const hexVerticalSpacing = hexHeight * 0.75

        const startX = zoomOrigin ? -zoomOrigin[0] : 0
        const startY = zoomOrigin ? -zoomOrigin[1] : 0

        const buffer = 8
        const overflowBuffer = parentScale * buffer

        const rows = Math.ceil(height / hexVerticalSpacing) + overflowBuffer
        const cols = Math.ceil(width / hexWidth) + overflowBuffer

        // Start with negative offset for buffer
        for (let row = -overflowBuffer; row < rows; row++) {
          for (let col = -overflowBuffer; col < cols; col++) {
            const x = col * hexWidth + (row % 2) * (hexWidth / 2) + startX
            const y = row * hexVerticalSpacing + hexHeight / 2 + startY

            drawHalfHex(offscreenCtx, x, y, size, color, lineWeightA)
          }
        }

        // Draw parent hexagons
        const parentHexWidth = hexWidth * parentScale
        const parentHexHeight = hexHeight * parentScale
        const parentHexVerticalSpacing = parentHexHeight * 0.75

        // Calculate the number of parent hexagons that fit within the scaled width
        const parentCols =
          Math.floor(width / (parentHexWidth * transform[2])) + buffer

        // Calculate the number of parent hexagon rows needed to cover the height
        const parentRows =
          Math.ceil(height / (parentHexVerticalSpacing * transform[2])) + buffer

        // Start with negative offset for buffer
        for (let row = -buffer; row < parentRows; row++) {
          for (let col = -buffer; col < parentCols; col++) {
            const x =
              col * parentHexWidth + (row % 2) * (parentHexWidth / 2) + startX
            const y =
              row * parentHexVerticalSpacing + parentHexHeight / 2 + startY

            drawHalfHex(
              offscreenCtx,
              x,
              y,
              size * parentScale,
              parentColor,
              lineWeightB // Use calculated lineWeightB
            )
          }
        }

        // Draw grandparent hexagons (zoomed out layer)
        const grandparentHexWidth = hexWidth * grandparentScale
        const grandparentHexHeight = hexHeight * grandparentScale
        const grandparentHexVerticalSpacing = grandparentHexHeight * 0.75
        const grandparentRows = Math.ceil(rows / grandparentScale) + buffer
        const grandparentCols = Math.ceil(cols / grandparentScale) + buffer

        // Start with negative offset for buffer
        for (let row = -buffer; row < grandparentRows; row++) {
          for (let col = -buffer; col < grandparentCols; col++) {
            const x =
              col * grandparentHexWidth +
              (row % 2) * (grandparentHexWidth / 2) +
              startX
            const y =
              row * grandparentHexVerticalSpacing +
              grandparentHexHeight / 2 +
              startY

            drawHalfHex(
              offscreenCtx,
              x,
              y,
              size * grandparentScale,
              grandparentColor,
              lineWeightC // Use calculated lineWeightC
            )
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
  }, [
    transform,
    width,
    height,
    d3Zoom,
    size,
    color,
    parentColor,
    parentScale,
    grandparentColor,
    grandparentScale,
  ])

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
