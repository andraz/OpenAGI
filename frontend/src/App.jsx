import { ReactFlow, useNodesState, useEdgesState } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import HexBackground from './HexBackground'

import nodeTypes from './Nodes/nodeTypes'

const initialNodes = [
  {
    id: '1',
    type: 'hexagon',
    data: { label: 'Hexagon Node' },
    position: { x: 100, y: 100 },
  },
]

const initialEdges = []

const App = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}>
      <HexBackground />
    </ReactFlow>
  )
}

export default App
