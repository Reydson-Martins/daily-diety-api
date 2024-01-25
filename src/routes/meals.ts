import { z } from 'zod'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { randomUUID } from 'crypto'
import { checkSessionId } from '../middleware/check-session-id-cookies'

export async function meals(app: FastifyInstance) {
  app.get('/', async () => {
    const meals = await knex.select().table('meals')
    return { meals }
  })

  app.post('/', { preHandler: [checkSessionId] }, async (request, reply) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      // is_diety: z.boolean(),
    })

    const userId = request.user?.id

    if (!userId) {
      return reply.status(401).send({ error: 'User not authenticated' })
    }

    const { name, description } = createMealsBodySchema.parse(request.body)
    console.log(userId)
    await knex('meals').insert({
      id: randomUUID(),
      id_user: userId,
      name,
      description,
      is_diety: false,
      created_at: new Date(),
      update_at: new Date(),
    })

    return reply.status(201).send()
  })
}
