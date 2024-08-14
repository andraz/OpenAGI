import { useEffect } from 'react'
import { useSocket } from '../context/SocketContext.jsx'

/**
 * Custom hook to handle socket event subscriptions.
 *
 * @param {string} event - The event name to subscribe to.
 * @param {Function} handler - The event handler function.
 */
const useSocketEvent = (event, handler) => {
  const { socket } = useSocket()

  useEffect(() => {
    if (socket) {
      socket.on(event, handler)

      return () => {
        socket.off(event, handler)
      }
    }
  }, [socket, event, handler])
}

export default useSocketEvent
