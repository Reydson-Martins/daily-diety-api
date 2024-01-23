import { z } from 'zod'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { randomUUID } from 'crypto'

export async function meals(app: FastifyInstance) {
  app.get('/', async () => {
    const meals = await knex.select().table('meals')
    return { meals }
  })

  app.post('/', async (request, reply) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      // is_diety: z.boolean(),
    })
    const { name, description } = createMealsBodySchema.parse(request.body)
    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      is_diety: false,
      created_at: new Date(),
      update_at: new Date(),
    })

    return reply.status(201).send()
  })
}
