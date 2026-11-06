import { defineConfig } from 'vite'

export default defineConfig({
  base: '/admin/',
  server: {
    allowedHosts: ['trgee.in', 'www.trgee.in'],
  },
})
