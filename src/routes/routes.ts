import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function apiRoutes(app: FastifyInstance) {
  app.post('/', async (req, res) => {
    const getTransactionsBodySchema = z.object({
      sessionId: z.string(),
    })

    const { sessionId } = getTransactionsBodySchema.parse(req.body)

    const transactions = await knex('transactions')
      .select()
      .where('session_id', sessionId)

    return res.status(200).send({
      transactions,
    })
  })

  app.post('/summary', async (req, res) => {
    const getSummaryBodySchema = z.object({
      sessionId: z.string(),
    })

    const { sessionId } = getSummaryBodySchema.parse(req.body)

    const summary = await knex('transactions')
      .select()
      .where('session_id', sessionId)
      .sum('amount', { as: 'amount' })

    return res.status(200).send(summary[0].amount)
  })

  app.post('/new', async (req, res) => {
    const newTranscationBodySchema = z.object({
      name: z.string(),
      amount: z.number(),
      type: z.string(),
      sessionId: z.string(),
    })

    let { name, amount, type, sessionId } = newTranscationBodySchema.parse(
      req.body,
    )

    const transaction = await knex('transactions')
      .insert({
        id: randomUUID(),
        name,
        amount: type === 'credit' ? amount : (amount = amount * -1),
        session_id: sessionId,
      })
      .returning('*')

    return res.status(201).send(transaction)
    // return res.status(201).send('Transação criada com sucesso! ✅')
  })

  app.post('/:id', async (req) => {
    const getSpecificTransactionParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = getSpecificTransactionParamsSchema.parse(req.params)

    const getSpecificTransactionSchema = z.object({
      sessionId: z.string(),
    })

    const { sessionId } = getSpecificTransactionSchema.parse(req.body)

    const transaction = await knex('transactions').select().where({
      id,
      session_id: sessionId,
    })

    return {
      transaction,
    }
  })

  app.post('/delete/:id', async (req, res) => {
    const deleteSpecificTransactionParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = deleteSpecificTransactionParamsSchema.parse(req.params)

    const deleteSpecificTransactionSchema = z.object({
      sessionId: z.string(),
    })

    const { sessionId } = deleteSpecificTransactionSchema.parse(req.body)

    await knex('transactions').delete().where({
      id,
      session_id: sessionId,
    })

    return res.send(`Transação: ${id} excluída com sucesso!`)
  })
}
