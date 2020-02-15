import { ApolloServer, PubSub } from 'apollo-server'

import { schema } from './schema'
import models from './model/index'

const pubsub = new PubSub()

const server = new ApolloServer({
  schema,
  context: async ({ req, res, connection }) => {
    let user = null
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '')
      user = await models.user.getUserByToken(token)
    }

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
