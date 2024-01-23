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

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
    }

    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })

    await knex('users').insert({
      id: randomUUID(),
      created_at: new Date(),
      name,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
