import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
} from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

/**
 * SocketProvider component that initializes and manages the Socket.IO connection.
 */
export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState(null)

  const socket = useMemo(
    () =>
      io('http://localhost:7777', {
        autoConnect: false,
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      }),
    []
  )

  useEffect(() => {
    socket.connect()

    // Expose websocket instance to the window object for debugging purposes.
    window.ws = socket

    socket.on('connect', () => {
      setIsConnected(true)
      setError(null)
      console.log('Connected to Socket.IO server')
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from Socket.IO server')
    })

    socket.on('reconnect_attempt', attempt => {
      console.log(`Reconnection attempt ${attempt}`)
    })

    socket.on('reconnect', () => {
      console.log('Reconnected to the server')
      setIsConnected(true)
    })

    socket.on('reconnect_failed', () => {
      console.log('Reconnection failed')
    })

    socket.on('connect_error', err => {
      setError(err)
      console.error('Connection error:', err)
    })

    return () => {
      socket.disconnect()
    }
  }, [socket])

  return (
    <SocketContext.Provider value={{ socket, isConnected, error }}>
      {children}
    </SocketContext.Provider>
  )
}

/**
 * Custom hook to access the Socket.IO client instance and connection status.
 */
export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
