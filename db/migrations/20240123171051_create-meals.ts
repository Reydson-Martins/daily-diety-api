import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', function (table) {
    table.uuid('id').primary()
    table.uuid('id_user').references('id').inTable('users')
    table.string('name', 255).notNullable()
    table.string('description', 255).notNullable()
    table.boolean('is_diety').defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('update_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
