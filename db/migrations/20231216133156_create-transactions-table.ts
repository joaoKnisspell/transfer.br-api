import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.decimal('number', 10, 2).notNullable() // Tamanho do número = 10 caracteres e número de casas decimais = 2
    table.uuid('session_id')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions')
}
