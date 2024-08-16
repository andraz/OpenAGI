import { Handle } from '@xyflow/react'
import Label from './Label'
import { useSocket } from '../../../context/SocketContext'
import { useState } from 'react'

const HexagonNode = ({ data }) => {
  // Hexagon width to height ratio
  const width = 104
  const height = (2 / Math.sqrt(3)) * width

  const { socket } = useSocket()

  const [showPopup, setShowPopup] = useState(false)

  return (
    <>
      <div
        onClick={e => {
          setShowPopup(true)
        }}
        className="hexagon bg-blue-500/15 bg-contain bg-top bg-no-repeat"
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
        <Label className="bold pointer-events-none absolute bottom-0 rounded-full bg-white/80 px-5 text-center font-thin leading-5 text-black shadow shadow-blue-500/20">
          {data.label}
        </Label>
        {showPopup && (
          <div
            onClick={e => setShowPopup(false)}
            className="absolute inset-0 rounded-xl bg-zinc-300/15 text-xs shadow-lg shadow-black/10 backdrop-blur-md">
            <div className="flex h-full w-full flex-col overflow-clip rounded-xl">
              <button
                className="flex-1 border-b border-white/30 bg-black/15 p-3 text-white/35"
                onClick={e => {
                  e.stopPropagation()

                  // Get the url for new avatar photo
                  const image = prompt('photo url', '')

                  // Sanity check
                  if (!image?.match(/^https?:\/\//)) {
                    alert('Invalid image url')
                    return
                  }

                  socket.emit('addJob', {
                    job: 'setNodeState',
                    data: {
                      id: data.id,
                      image,
                    },
                  })
                  setShowPopup(false)
                }}>
                set photo
              </button>
              <button
                className="flex-1 bg-black/15 p-3 text-white/35"
                onClick={e => {
                  e.stopPropagation()

                  // Get the name
                  const fullName = prompt(
                    'Full name (min 2 words, min 3 chars/word)',
                    ''
                  )

                  // Sanity check for name
                  const nameParts = fullName.split(' ')

                  if (
                    fullName.length === 0 ||
                    nameParts.length < 2 ||
                    nameParts.some(name => name.length < 3)
                  ) {
                    alert(
                      'Invalid name. It should be at least 2 words, each with 3 characters or more.'
                    )
                    return
                  }

                  // Capitalize the first letter of each word
                  const capitalizedName = nameParts.map(
                    name => name.charAt(0).toUpperCase() + name.slice(1)
                  )

                  socket.emit('addJob', {
                    job: 'setNodeState',
                    data: {
                      id: data.id,
                      name: capitalizedName.join(' '),
                    },
                  })
                  setShowPopup(false)
                }}>
                set name
              </button>
            </div>
            <button
              className="absolute -right-4 -top-5 h-6 w-6 rounded-full bg-black/15 p-1 text-white shadow-sm"
              onClick={e => setShowPopup(false)}>
              ×
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default HexagonNode
