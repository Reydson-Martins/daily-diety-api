import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function users(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex.select().table('users')
    return { users }
  })
  app.post('/', async (request, reply) => {
    // {id, name, created_at}
    const createUserBodySchema = z.object({
      name: z.string(),
    })

    const { name } = createUserBodySchema.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      created_at: new Date(),
      name,
    })

    return reply.status(201).send()
  })
}
