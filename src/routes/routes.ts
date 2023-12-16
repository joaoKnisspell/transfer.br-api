import { FastifyInstance } from 'fastify'

export async function apiRoutes(app: FastifyInstance) {
  await app.get('/', async (req, res) => {
    await res.status(200).send('Aqui serão listadas as transações!')
  })
}
