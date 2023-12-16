import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function apiRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const initialData = await knex('sqlite_schema').select('*')

    return initialData
  })
}
