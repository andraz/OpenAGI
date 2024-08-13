import { Handle } from '@xyflow/react'
import Label from './Label'

const HexagonNode = ({ data }) => {
  // Hexagon width to height ratio
  const width = 104
  const height = (2 / Math.sqrt(3)) * width

  return (
    <>
      <div
        className="hexagon bg-transparent bg-contain bg-top bg-no-repeat"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundImage: `url(${data.src})`,
        }}>
        {/* <Handle type="target" position="left" /> */}
        {/* <Handle type="source" position="right" /> */}
      </div>
      <div className="inset-0 grid place-items-center">
        <Label data={data} />
      </div>
    </>
  )
}

export default HexagonNode
