import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import { AuthProvider } from './components/AuthContext.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#09090b',
            color: '#f5f5f5',
            border: '1px solid rgba(168, 85, 247, 0.35)',
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>,
)
