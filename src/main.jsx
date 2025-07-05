import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RoutesProject from './router/RoutesProject.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { CartProvider } from './contexts/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <RoutesProject />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
