import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
} from '@xyflow/react'

import '@xyflow/react/dist/style.css'

import HexBackground from './components/background/hex'

import nodeTypes from './components/nodes/nodeTypes'
import initialNodes from './initialNodes'
import useHexSnap from './hooks/useHexSnap'
import { gridSize } from './settings'

const initialEdges = []

import { SocketProvider } from './context/SocketContext'

const App = () => {
  const [nodes, setNodes] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)
  const onNodesChange = useHexSnap(setNodes)

  return (
    <SocketProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        nodeOrigin={[0.5, 0.5]}
        maxZoom={5}
        minZoom={0.05}>
        <HexBackground size={gridSize} parentScale={7} />
      </ReactFlow>
    </SocketProvider>
  )
}

export default App
