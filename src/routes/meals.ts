import { z } from 'zod'
import { knex } from '../database'
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify'
import { randomUUID } from 'crypto'
import { checkSessionId } from '../middleware/check-session-id-cookies'

export async function meals(app: FastifyInstance) {
  // retornar todas as refeicoes de usuario, retornar apenas uma refeicao id
  app.get(
    '/',
    { preHandler: [checkSessionId] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { sessionId } = request.cookies

      const user = await knex
        .select('id')
        .table('users')
        .where({ session_id: sessionId })
        .first()
      if (!user) {
        return reply.status(401).send({ error: 'Unauthorized' })
      }

      const meals = await knex
        .select()
        .table('meals')
        .where({ id_user: user?.id })
      return { meals }
    },
  )

  app.post(
    '/',
    { preHandler: [checkSessionId] },
    async (request, reply) => {
      const createMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        is_diety: z.boolean(),
      })

      const userId = request.user?.id

      if (!userId) {
        return reply
          .status(401)
          .send({ error: 'User not authenticated' })
      }

      const { name, description, is_diety } =
        createMealsBodySchema.parse(request.body)

      await knex('meals').insert({
        id: randomUUID(),
        id_user: userId,
        name,
        description,
        is_diety,
        created_at: new Date(),
        update_at: new Date(),
      })

      return reply.status(201).send()
    },
  )

  app.put(
    '/:mealId',
    { preHandler: [checkSessionId] },
    async (request, reply) => {
      try {
        const paramasSchema = z.object({
          mealId: z.string().uuid(),
        })

        const updateMealBodySchema = z.object({
          name: z.string(),
          description: z.string(),
          is_diety: z.boolean(),
        })

        const { mealId } = paramasSchema.parse(request.params)
        const { name, description, is_diety } =
          updateMealBodySchema.parse(request.body)

        const existinMeal = await knex('meals')
          .where({ id: mealId })
          .first()
        if (!existinMeal) {
          return reply.status(404).send({ error: 'Meal not found' })
        }

        await knex('meals').where({ id: mealId }).update({
          name,
          description,
          is_diety,
          update_at: new Date(),
        })
        return reply
          .status(200)
          .send({ message: 'Meal Update successfully' })
      } catch (error) {
        console.log(error)

        return reply
          .status(500)
          .send({ error: 'Internal Server Error' })
      }
    },
  )

  app.delete(
    '/:mealId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const paramasSchema = z.object({
          mealId: z.string().uuid(),
        })
        const { mealId } = paramasSchema.parse(request.params)
        await knex('meals').where({ id: mealId }).delete()
        console.log(request.params)
        return { success: true }
      } catch (error) {
        return reply
          .status(500)
          .send({ error: 'Internal Server Error' })
      }
    },
  )
}
