import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Variables sin las que el sitio publicado no funciona. Si falta alguna, el build se corta con un
// mensaje claro (antes el sitio se publicaba apuntando a localhost, sin ningún aviso).
const VARIABLES_OBLIGATORIAS = {
  VITE_API_URL: 'URL de la API, por ejemplo https://api.flexstudio.com.ar',
  VITE_RECAPTCHA_SITE_KEY: 'clave del sitio de reCAPTCHA v3 (login, registro y contacto)',
}

const verificarVariables = (mode: string) => {
  const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env }
  const faltantes = Object.entries(VARIABLES_OBLIGATORIAS).filter(([nombre]) => !env[nombre]?.trim())
  if (faltantes.length) {
    const detalle = faltantes.map(([nombre, para]) => `  - ${nombre}: ${para}`).join('\n')
    throw new Error(`Faltan variables de entorno para el build:\n${detalle}\nEn Vercel: Settings → Environment Variables.`)
  }
  const api = env.VITE_API_URL!.trim()
  if (mode === 'production' && !api.startsWith('https://')) {
    throw new Error(`VITE_API_URL tiene que ser https en producción (es "${api}").`)
  }
}

export default defineConfig(({ command, mode }) => {
  if (command === 'build') verificarVariables(mode)
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    build: {
      sourcemap: false,
      rolldownOptions: {
        output: {
          // Las pantallas se cargan por separado (React.lazy en AppRouter). Las librerías base van
          // agrupadas en pocos archivos estables: menos pedidos en la home (antes cada ícono era un
          // archivo aparte) y siguen en caché entre deploys mientras no cambie su versión.
          codeSplitting: {
            groups: [
              { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/ },
              { name: 'datos', test: /node_modules[\\/](@tanstack|axios|zustand)[\\/]/ },
              { name: 'iconos', test: /node_modules[\\/]lucide-react[\\/]/ },
            ],
          },
        },
      },
    },
  }
})
