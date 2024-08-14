import hexSnap from './hexSnap'

const initialNodes = [
  {
    id: '1',
    type: 'actor',
    data: {
      name: 'Jane Swith',
      image:
        'https://qpowxrmcvprnjmmsxdwb.supabase.co/storage/v1/object/public/avatar/Jane%20Swith.jpeg',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    type: 'actor',
    data: {
      name: 'Alice Johnson',
      image:
        'https://qpowxrmcvprnjmmsxdwb.supabase.co/storage/v1/object/public/avatar/Alice%20Johnson.jpeg',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: '3',
    type: 'actor',
    data: {
      name: 'Bob Brown',
      image:
        'https://qpowxrmcvprnjmmsxdwb.supabase.co/storage/v1/object/public/avatar/Bob%20Brown.jpeg',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: '4',
    type: 'actor',
    data: {
      name: 'Charlie Davis',
      image:
        'https://qpowxrmcvprnjmmsxdwb.supabase.co/storage/v1/object/public/avatar/Charlie%20Davis.jpeg',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: '5',
    type: 'actor',
    data: {
      name: 'Ben Noben',
      image:
        'https://qpowxrmcvprnjmmsxdwb.supabase.co/storage/v1/object/public/avatar/Ben%20Noben.jpeg',
    },
    position: { x: 0, y: 0 },
  },
]

let alignedNodes = []
let overlappingNodes = true
let iterationLimit = 100

while (overlappingNodes && iterationLimit > 0) {
  // Limit the number of iterations to avoid infinite loops
  iterationLimit--

  // Generate random positions for nodes
  alignedNodes = initialNodes.map(node => {
    // Randomize position in center 50% of the window bounds
    const position = {
      x: window.innerWidth * 0.25 + (Math.random() * window.innerWidth) / 2,
      y: window.innerHeight * 0.25 + (Math.random() * window.innerHeight) / 2,
    }

    node.position = hexSnap(position)
    return node
  })

  // Check for overlaps
  overlappingNodes = alignedNodes.some((node, index) =>
    alignedNodes.some(
      (otherNode, otherIndex) =>
        index !== otherIndex &&
        Math.abs(node.position.x - otherNode.position.x) <= 200 &&
        Math.abs(node.position.y - otherNode.position.y) <= 200
    )
  )
}

export default alignedNodes
