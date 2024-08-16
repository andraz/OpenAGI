import HexagonNode from '../Hexagon'
import useSocketEvent from '../../../hooks/useSocketEvent'
import { useEffect, useState } from 'react'
import useSocketEmit from '../../../hooks/useSocketEmit'

/**
 * Actor component represent a persona
 * @param {Object} props - The properties of the Actor component.
 * @param {string} props.image - The URL of the actor's image.
 * @param {string} props.name - The name of the actor.
 */
const Actor = props => {
  const [actorData, setActorData] = useState(props.data)

  const actorEventName = `actorUpdate:${props.id}`

  useSocketEvent(actorEventName, message => {
    console.log(actorEventName, message)

    // Update the actor data if data changed
    if (JSON.stringify(message) !== JSON.stringify(actorData)) {
      setActorData(message)
    }
  })

  // Destructure the props object
  const { image, name } = actorData

  // Prepare name for the label
  const labelName = name || 'Valar Dohaeris' // The anon has no name

  // Prepare image
  const src =
    image ||
    'https://qpowxrmcvprnjmmsxdwb.supabase.co/storage/v1/object/public/avatar/valar.jpeg'

  // Use full first name and 1. capital from second name
  const label = labelName.split(' ')[0] + ' ' + labelName.split(' ')[1][0] + '.'

  const [time, setTime] = useState('')

  useSocketEvent('time', message => {
    setTime(message)
  })

  const socketEmit = useSocketEmit('actorClick', props)

  // Render the HexagonNode component with the prepared data
  return (
    <HexagonNode
      onClick={e => {
        console.log('clicked', props)
        socketEmit({ e, props })
      }}
      data={{
        src,
        label,
        time,
        id: props.id,
      }}
    />
  )
}

export default Actor
