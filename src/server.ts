import fastify from 'fastify'
import { apiRoutes } from './routes/routes'
import { env } from './env'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)

app.register(apiRoutes, {
  prefix: '/transactions',
})

app
  .listen({
    port: env.SERVER_ROUTE,
  })
  .then(() => {
    return console.log(`🚀 Server runing on port: ${env.SERVER_ROUTE}`)
  })
