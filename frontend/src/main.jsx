import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ReactFlowProvider } from '@xyflow/react'
import { SocketProvider } from './context/SocketContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReactFlowProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </ReactFlowProvider>
  </StrictMode>
)
