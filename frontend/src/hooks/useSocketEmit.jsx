// frontend/src/hooks/useSocketEmit.jsx
import { useEffect, useCallback } from 'react'
import { useSocket } from '../context/SocketContext.jsx'

/**
 * Custom hook to handle socket event emissions.
 *
 * @param {string} event - The event name to emit.
 * @param {Object} props - The properties of the component that is emitting the event.
 * @returns {Function} A function that can be called to emit the event with optional data on click.
 */
const useSocketEmit = (event, props) => {
  const { socket } = useSocket()

  const socketEmit = useCallback(
    (data = {}) => {
      if (socket) {
        const emitData = { ...data, ...props }
        socket.emit(event, emitData)
      }
    },
    [socket, event, props]
  )

  return socketEmit
}

export default useSocketEmit
