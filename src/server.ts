import { app } from './app'
import { env } from './env'

app
  .listen({
    port: env.SERVER_ROUTE,
  })
  .then(() => {
    return console.log(`🚀 Server runing on port: ${env.SERVER_ROUTE}`)
  })
