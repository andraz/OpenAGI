import { ReactFlow, useNodesState, useEdgesState } from '@xyflow/react'

import '@xyflow/react/dist/style.css'

import HexBackground from './components/background/hex'

import nodeTypes from './components/nodes/nodeTypes'
import useHexSnap from './hooks/useHexSnap'
import { gridSize } from './settings'

const initialEdges = []

import { useEffect } from 'react'
import useSocketEvent from './hooks/useSocketEvent'

const App = () => {
  const [nodes, setNodes] = useNodesState([])
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)
  const onNodesChange = useHexSnap(setNodes)

  // Listen for the 'updatedNode' event
  useSocketEvent('updatedNode', updatedNode => {
    // Prepare replacement node
    const replacementNode = {
      ...updatedNode.data,
      type: updatedNode?.data?.type || 'actor', // Ensure type is defined
      id: updatedNode.id,
    }

    // Update the node in the state
    setNodes(nodes =>
      nodes.map(node => (node.id === updatedNode.id ? replacementNode : node))
    )
  })

  // Get the world state on initial load
  useEffect(() => {
    window?.ws?.emit('getWorldState', worldState => {
      setNodes(
        worldState.map(node => ({
          position: {
            x: parseInt(node?.data?.position?.x, 10) || 0,
            y: parseInt(node?.data?.position?.y, 10) || 0,
          },

          type: node?.data?.type || 'actor',

          id: node?.id || window?.crypto?.randomUUID(),

          data: node?.data || {},
        }))
      )
    })
  }, [])

  return (
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
  )
}

export default App
