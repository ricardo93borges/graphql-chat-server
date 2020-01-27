import { ApolloServer, PubSub } from 'apollo-server'

import { schema } from './schema'
import models from './model/index'

const pubsub = new PubSub()

const server = new ApolloServer({
  schema,
  context: async ({ req, res, connection }) => {
    const token = req.headers.authorization.replace('Bearer ', '')
    const user = await models.user.getUserByToken(token)

    return {
      models,
      pubsub,
      user
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
