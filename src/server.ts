import fastify from 'fastify'
import { apiRoutes } from './routes/routes'

export const app = fastify()

app.register(apiRoutes, {
  prefix: '/transactions',
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    return console.log('🚀 Server runing on port: 3333')
  })
