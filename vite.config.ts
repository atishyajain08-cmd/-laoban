import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Project is deployed to GitHub Pages under https://<user>.github.io/-laoban/
// (the repo was created with a leading dash), so production assets must be served
// from the "/-laoban/" base. In dev we keep "/" so the local server stays at
// http://localhost:3000/.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/-laoban/' : '/',
  plugins: [react()],
  server: {
    // Honour a PORT injected by tooling (e.g. the preview harness); default to 3000.
    port: Number(process.env.PORT) || 3000,
    strictPort: false,
  },
}))
