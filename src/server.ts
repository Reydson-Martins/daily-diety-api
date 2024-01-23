import fastify from 'fastify'
import { users } from './routes/users'
import { env } from './env'

const app = fastify()
app.register(users)

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
