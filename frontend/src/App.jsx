import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
} from '@xyflow/react'

import '@xyflow/react/dist/style.css'

import HexBackground from './HexBackground'

import nodeTypes from './Nodes/nodeTypes'
import { initialNodes } from './initialNodes'

const initialEdges = []

const gridSize = 60 // Assume this is consistent with your HexBackground size

const hexSnap = position => {
  const hexWidth = gridSize * Math.sqrt(3)
  const hexVerticalSpacing = gridSize * 2 * 0.75

  // Adjust the horizontal calculation to align with hexagon centers:
  const col = Math.round(
    (position.x - hexWidth - (position.y % (2 * hexVerticalSpacing)) / 2) /
      hexWidth
  )

  const row = Math.round(
    (position.y - hexVerticalSpacing * 0.5) / hexVerticalSpacing
  )

  const x = col * hexWidth + (row % 2) * (hexWidth / 2) + hexWidth / 2 // Center x coordinate
  const y = row * hexVerticalSpacing

  // Offset the x and y coordinates by half the node's width and height:
  const xOffset = hexWidth / 2
  const yOffset = hexVerticalSpacing * 0.3333 // Height of the hexagon

  return { x: x + xOffset, y: y + yOffset }
}

const App = () => {
  const [nodes, setNodes] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const onNodesChangeWithSnapping = changes => {
    changes = changes.map(change => {
      if (change.type === 'position') {
        // Check if previousPosition exists:
        if (change.previousPosition) {
          if (
            Math.abs(change.position.x - change.previousPosition.x) >=
            Math.abs(change.position.y - change.previousPosition.y)
          ) {
            const hexCoords = cartesianToHex(change.position, gridSize)
            hexCoords.q = Math.round(hexCoords.q)
            change.position = hexToCartesian(hexCoords, gridSize)
          } else {
            change.position = hexSnap(change.position)
          }
          console.log(change.position)
        } else {
          // For new nodes or initial programmatic positioning, use regular hexSnap:
          change.position = hexSnap(change.position)
        }
      }
      return change
    })
    setNodes(nds => applyNodeChanges(changes, nds))
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChangeWithSnapping}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}>
      <HexBackground size={gridSize} />
      <HexBackground size={gridSize} />
    </ReactFlow>
  )
}

export default App
