import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { addRequest, getRequests } from './db.js'

function weatherDb() {
  return {
    name: 'weather-db',
    configureServer(server) {
      server.middlewares.use('/api/requests', (req, res) => {
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(getRequests()))
          return
        }

        if (req.method !== 'POST') {
          res.statusCode = 404
          res.end()
          return
        }

        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', () => {
          const { city, weather } = JSON.parse(body)
          addRequest(city, weather)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(getRequests()))
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), weatherDb()],
})
