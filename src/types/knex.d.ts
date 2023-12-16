// eslint-disable-next-line
import { knex } from "../database";

declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string
      session_id?: string
      name: string
      amount: number
      created_at: string
    }
  }
}
