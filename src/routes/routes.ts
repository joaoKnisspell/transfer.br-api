import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionIdCookie } from '../middlewares/check-session-id-cookie'

export async function apiRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionIdCookie] }, async (req, res) => {
    const { sessionId } = req.cookies

    const transactions = await knex('transactions')
      .select()
      .where('session_id', sessionId)

    return res.status(200).send({
      transactions,
    })
  })

  app.get(
    '/summary',
    { preHandler: [checkSessionIdCookie] },
    async (req, res) => {
      const { sessionId } = req.cookies

      const summary = await knex('transactions')
        .select()
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })

      return res.status(200).send(summary[0].amount)
    },
  )

  app.post('/new', async (req, res) => {
    let { sessionId } = req.cookies

    if (!sessionId) {
      sessionId = randomUUID()

      res.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    const newTranscationBodySchema = z.object({
      name: z.string(),
      amount: z.number(),
      type: z.string(),
    })

    const { name, amount, type } = newTranscationBodySchema.parse(req.body)

    await knex('transactions').insert({
      id: randomUUID(),
      name,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return res.status(201).send('Transação criada com sucesso! ✅')
  })

  app.get('/:id', { preHandler: [checkSessionIdCookie] }, async (req) => {
    const getSpecificTransactionParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = getSpecificTransactionParamsSchema.parse(req.params)

    const { sessionId } = req.cookies

    const transaction = await knex('transactions').select().where({
      id,
      session_id: sessionId,
    })

    return {
      transaction,
    }
  })

  app.delete(
    '/delete/:id',
    { preHandler: [checkSessionIdCookie] },
    async (req, res) => {
      const deleteSpecificTransactionParamsSchema = z.object({
        id: z.string(),
      })

      const { id } = deleteSpecificTransactionParamsSchema.parse(req.params)

      const { sessionId } = req.cookies

      await knex('transactions').delete().where({
        id,
        session_id: sessionId,
      })

      return res.send(`Transação: ${id} excluída com sucesso!`)
    },
  )

  // app.post('/', async (req, res) => {
  //   const getTransactionsBodySchema = z.object({
  //     sessionId: z.string(),
  //   })

  //   const { sessionId } = getTransactionsBodySchema.parse(req.body)

  //   const transactions = await knex('transactions')
  //     .select()
  //     .where('session_id', sessionId)

  //   return res.status(200).send({
  //     transactions,
  //   })
  // })

  // app.post('/summary', async (req, res) => {
  //   const getSummaryBodySchema = z.object({
  //     sessionId: z.string(),
  //   })

  //   const { sessionId } = getSummaryBodySchema.parse(req.body)

  //   const summary = await knex('transactions')
  //     .select()
  //     .where('session_id', sessionId)
  //     .sum('amount', { as: 'amount' })

  //   return res.status(200).send(summary[0].amount)
  // })

  // app.post('/new', async (req, res) => {
  //   const newTranscationBodySchema = z.object({
  //     name: z.string(),
  //     amount: z.number(),
  //     type: z.string(),
  //     sessionId: z.string(),
  //   })

  //   const { name, amount, type, sessionId } = newTranscationBodySchema.parse(
  //     req.body,
  //   )

  //   const transaction = await knex('transactions')
  //     .insert({
  //       id: randomUUID(),
  //       name,
  //       amount: type === 'credit' ? amount : amount * -1,
  //       session_id: sessionId,
  //     })
  //     .returning('*')

  //   return res.status(201).send(transaction)
  //   // return res.status(201).send('Transação criada com sucesso! ✅')
  // })

  // app.post('/:id', async (req) => {
  //   const getSpecificTransactionParamsSchema = z.object({
  //     id: z.string(),
  //   })

  //   const { id } = getSpecificTransactionParamsSchema.parse(req.params)

  //   const getSpecificTransactionSchema = z.object({
  //     sessionId: z.string(),
  //   })

  //   const { sessionId } = getSpecificTransactionSchema.parse(req.body)

  //   const transaction = await knex('transactions').select().where({
  //     id,
  //     session_id: sessionId,
  //   })

  //   return {
  //     transaction,
  //   }
  // })

  // app.post('/delete/:id', async (req, res) => {
  //   const deleteSpecificTransactionParamsSchema = z.object({
  //     id: z.string(),
  //   })

  //   const { id } = deleteSpecificTransactionParamsSchema.parse(req.params)

  //   const deleteSpecificTransactionSchema = z.object({
  //     sessionId: z.string(),
  //   })

  //   const { sessionId } = deleteSpecificTransactionSchema.parse(req.body)

  //   await knex('transactions').delete().where({
  //     id,
  //     session_id: sessionId,
  //   })

  //   return res.send(`Transação: ${id} excluída com sucesso!`)
  // })
}
