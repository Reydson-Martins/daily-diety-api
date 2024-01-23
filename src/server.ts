import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { users } from './routes/users'
import { meals } from './routes/meals'
import { env } from './env'

const app = fastify()

app.register(cookie)

app.register(users, {
  prefix: 'users',
})
app.register(meals, {
  prefix: 'meals',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
