import { Handle } from '@xyflow/react'
import Label from './Label'

const HexagonNode = ({ onClick, data }) => {
  // Hexagon width to height ratio
  const width = 104
  const height = (2 / Math.sqrt(3)) * width

  return (
    <>
      <div
        onClick={onClick}
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
        <Label
          style={{ transform: 'rotate(30deg)' }}
          className="absolute -right-px top-4 font-mono text-[5px] text-white/75">
          {data.time}
        </Label>
        <Label>{data.label}</Label>
      </div>
    </>
  )
}

export default HexagonNode
