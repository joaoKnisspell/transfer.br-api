import fastify from 'fastify'
import { apiRoutes } from './routes/routes'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors'

export const app = fastify()

app.register(cookie)

app.register(cors, {
  origin: '*',
})

app.register(apiRoutes, {
  prefix: '/transactions',
})
