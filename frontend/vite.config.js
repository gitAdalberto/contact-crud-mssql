import { defineConfig } from "vite"
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite acceso externo
    port: 4000, // asegúrate que coincida con tu puerto
    allowedHosts: ["crud.adalserver.net"] // permite tu subdominio
  }
})
