import { applyNodeChanges } from '@xyflow/react'
import hexSnap from './hexSnap'

const useNodesChange = setNodes => changes => {
  changes = changes.map(change => {
    // Check if the change is a position change
    if (change.type === 'position') {
      // Apply hexagonal snapping to the new position
      change.position = hexSnap(change.position)
    }
    return change
  })
  setNodes(nds => applyNodeChanges(changes, nds))
}

export default useNodesChange
