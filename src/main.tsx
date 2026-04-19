import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import './index.css'
import App from './App.tsx'

console.log("Llave de reCAPTCHA:", import.meta.env.VITE_RECAPTCHA_SITE_KEY);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
      <App />
    </GoogleReCaptchaProvider>
  </StrictMode>,
)