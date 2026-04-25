import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

console.log("Llave de reCAPTCHA:", import.meta.env.VITE_RECAPTCHA_SITE_KEY);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
        <App />
      </GoogleReCaptchaProvider>
    </QueryClientProvider>
  </StrictMode>,
)