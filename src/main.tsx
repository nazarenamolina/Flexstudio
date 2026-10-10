import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { isAxiosError } from 'axios'
import './index.css'
import App from './App.tsx'
import { recargarPorVersionNueva } from './versionNueva'

// Vite avisa cuando no puede descargar una parte del sitio (por ejemplo, después de un deploy).
// Se recarga una vez para traer la versión nueva; si vuelve a fallar, lo muestra LimiteDeError.
window.addEventListener('vite:preloadError', (evento) => {
  if (recargarPorVersionNueva()) evento.preventDefault()
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      // Un 4xx (sin acceso, no existe, sesión vencida) no se arregla repitiendo el pedido: solo demora el aviso.
      retry: (intentos, error) => {
        const estado = isAxiosError(error) ? error.response?.status : undefined
        if (estado && estado >= 400 && estado < 500) return false
        return intentos < 1
      },
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
        <App />
      </GoogleReCaptchaProvider>
    </QueryClientProvider>
  </StrictMode>,
)