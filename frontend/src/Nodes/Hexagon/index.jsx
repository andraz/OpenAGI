import { Handle } from '@xyflow/react'
import Label from './Label'

const HexagonNode = ({ data }) => {
  // Hexagon width to height ratio
  const width = 104
  const height = (2 / Math.sqrt(3)) * width

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
