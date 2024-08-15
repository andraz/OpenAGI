import { applyNodeChanges } from '@xyflow/react'
import hexSnap from './hexSnap'

/**
 * Updates the node positions by applying hexagonal snapping to the new positions.
 *
 * @param {function} setNodes - The function to update the nodes.
 * @returns {function} - A function that takes the changes to be applied to the nodes.
 */
const useHexSnap = setNodes => changes => {
  changes = changes.map(change => {
    // Check if the change is a position change
    if (change.type === 'position') {
      // Apply hexagonal snapping to the new position
      change.position = hexSnap(change.position)
    }
    return change
  })

  // Find if any position change is with dragging false meaning dragging has ended
  for (const change of changes) {
    if (change.type === 'position' && !change.dragging) {
      // Extract the id and position from the change object
      const { id, position } = change

      // Emit a 'addJob' event to the WebSocket connection with the job and data
      window.ws.emit('addJob', {
        job: 'setNodeState',
        data: { id, position },
      })
    }
  }

  setNodes(nds => applyNodeChanges(changes, nds))
}

export default useHexSnap
