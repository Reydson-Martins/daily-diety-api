import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function users(app: FastifyInstance) {
  app.get('/teste', async () => {
    const tables = await knex.select().table('sqlite_schema')
    return tables
  })
}
