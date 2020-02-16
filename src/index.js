import { ApolloServer, PubSub } from 'apollo-server'

import { schema } from './schema'
import models from './model/index'

const pubsub = new PubSub()

const getUser = async (req, connection) => {
  let user = null

  if (req && req.headers.authorization) {
    const token = req.headers.authorization.replace('Bearer ', '')
    user = await models.user.getUserByToken(token)
  } else if (connection && connection.context.Authorization) {
    const token = connection.context.Authorization.replace('Bearer ', '')
    user = await models.user.getUserByToken(token)
  }

  return user
}

const server = new ApolloServer({
  schema,
  context: async ({ req, res, connection }) => {
    return {
      models,
      pubsub,
      user: await getUser(req, connection)
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
