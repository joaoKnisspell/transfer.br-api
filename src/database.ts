import { knex as setupKnex, Knex } from 'knex'

export const dbConfig: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: './db/app.db',
  },
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
  useNullAsDefault: true,
}

export const knex = setupKnex(dbConfig)
