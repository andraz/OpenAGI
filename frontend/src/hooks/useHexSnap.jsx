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
  setNodes(nds => applyNodeChanges(changes, nds))
}

export default useHexSnap
