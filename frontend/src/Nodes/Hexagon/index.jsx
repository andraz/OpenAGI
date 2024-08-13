import { Handle } from '@xyflow/react'
import Label from './Label'

const HexagonNode = ({ data }) => {
  // Hexagon height to width ratio
  const height = 108
  const width = (Math.sqrt(3) / 2) * height

  return (
    <div
      className="hexagon grid place-items-center bg-blue-500"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}>
      <Handle type="target" position="left" />
      <Handle type="source" position="right" />
      <Label data={data} />
    </div>
  )
}

export default HexagonNode
