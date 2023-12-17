import request from 'supertest'
import { app } from '../src/app'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { beforeEach } from 'node:test'
import { execSync } from 'node:child_process'

describe('Transactions', () => {
  beforeAll(() => {
    // is server ready?
    app.ready()
  })

  afterAll(() => {
    // quiting server
    app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to add a new transaction', async () => {
    const response = await request(app.server).post('/transactions/new').send({
      name: 'New transaction',
      amount: 500,
      type: 'credit',
    })

    expect(response.statusCode).toEqual(201)
  })

  it('should be able to list all user transactions', async () => {
    const newTransactionResponse = await request(app.server)
      .post('/transactions/new')
      .send({
        name: 'New transaction',
        amount: 500,
        type: 'credit',
      })

    const cookie = newTransactionResponse.get('Set-Cookie')

    const getUserTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie)

    expect(getUserTransactionsResponse.statusCode).toEqual(200)
    expect(getUserTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        name: 'New transaction',
        amount: 500,
      }),
    ])
  })

  it('should be able to get an specific transaction', async () => {
    const newTransactionResponse = await request(app.server)
      .post('/transactions/new')
      .send({
        name: 'New transaction',
        amount: 150,
        type: 'credit',
      })

    const cookie = newTransactionResponse.get('Set-Cookie')

    const getUserTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie)

    const specificTransactionId =
      getUserTransactionsResponse.body.transactions[0].id

    const getUserSpecificTransactionResponse = await request(app.server)
      .get(`/transactions/${specificTransactionId}`)
      .set('Cookie', cookie)

    expect(getUserSpecificTransactionResponse.body.transaction).toEqual([
      expect.objectContaining({
        name: 'New transaction',
        amount: 150,
      }),
    ])
  })

  it('should be able to delete an specific transaction', async () => {
    const newTransactionResponse = await request(app.server)
      .post('/transactions/new')
      .send({
        name: 'New transaction',
        amount: 150,
        type: 'credit',
      })

    const cookie = newTransactionResponse.get('Set-Cookie')

    const getUserTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie)

    const specificTransactionId =
      getUserTransactionsResponse.body.transactions[0].id

    const deleteSpecificTransactionResponse = await request(app.server)
      .delete(`/transactions/delete/${specificTransactionId}`)
      .set('Cookie', cookie)

    expect(deleteSpecificTransactionResponse.text).toEqual(
      `Transação: ${specificTransactionId} excluída com sucesso!`,
    )
  })

  it('should be able to get user summary', async () => {
    const newTransactionResponse = await request(app.server)
      .post('/transactions/new')
      .send({
        name: 'New transaction',
        amount: 500,
        type: 'credit',
      })

    const cookie = newTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions/new')
      .send({
        name: 'New transaction 2',
        amount: 300,
        type: 'debit',
      })
      .set('Cookie', cookie)

    const getUserSummaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookie)

    expect(getUserSummaryResponse.body).toEqual(200)
  })
})
