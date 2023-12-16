import request from 'supertest'
import { app } from '../src/app'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'

describe('Transactions', () => {
  beforeAll(() => {
    // is server ready?
    app.ready()
  })

  afterAll(() => {
    // quiting server
    app.close()
  })

  it('should be able to add a new transaction', async () => {
    const response = await request(app.server).post('/transactions/new').send({
      name: 'New transaction',
      amount: 500,
      type: 'credit',
    })

    expect(response.statusCode).toEqual(201)
  })
})
