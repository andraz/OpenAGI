import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
} from '@xyflow/react'

import '@xyflow/react/dist/style.css'

import HexBackground from './HexBackground'

import nodeTypes from './Nodes/nodeTypes'
import initialNodes from './initialNodes'
import useNodesChange from './useNodesChange'
import { gridSize } from './settings'

const initialEdges = []

import { SocketProvider } from './context/SocketContext'

const App = () => {
  const [nodes, setNodes] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)
  const onNodesChange = useNodesChange(setNodes)

  return (
    <SocketProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}>
        <HexBackground size={gridSize} />
      </ReactFlow>
    </SocketProvider>
  )
}

export default App
