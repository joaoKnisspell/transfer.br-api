import fastify from 'fastify'
import { apiRoutes } from './routes/routes'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)

app.register(apiRoutes, {
  prefix: '/transactions',
})
