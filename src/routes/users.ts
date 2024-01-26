import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionId } from '../middleware/check-session-id-cookies'
import { request } from 'http'

export async function users(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionId] }, async (request, reply) => {
    const { sessionId } = request.cookies
    const users = await knex
      .select()
      .table('users')
      .where('session_id', sessionId)
    return { users }
  })
  app.post('/', async (request, reply) => {
    // {id, name, created_at}
    const createUserBodySchema = z.object({
      name: z.string(),
    })

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
    }
    const { name } = createUserBodySchema.parse(request.body)

    const userByName = await knex('users').where({ name }).first()

    if (userByName) {
      return reply.status(400).send({ message: 'User already exists' })
    }

    // const sessionId = randomUUID()

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
