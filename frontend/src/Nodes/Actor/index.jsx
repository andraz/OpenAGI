import HexagonNode from '../Hexagon'

/**
 * Actor component represent a persona with a picture, name and a backstory.
 * @param {Object} props - The properties of the Actor component.
 * @param {string} props.image - The URL of the actor's image.
 * @param {string} props.name - The name of the actor.
 * @param {string} props.backstory - The backstory of the actor.
 */
const Actor = props => {
  // Destructure the props object to get the image, name, and backstory
  const { image, name, backstory } = props.data

  // Prepare first name for the label
  const firstName = name.split(' ')[0]

  // Render the HexagonNode component with the prepared data
  return (
    <HexagonNode
      data={{
        src: image,
        label: firstName,
      }}
    />
  )
}

export default Actor