import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer, PubSub } from 'apollo-server-express'
import { schema } from './schema'
import models from './model/index'

const app = express();
app.use('/graphql', bodyParser.json());

// Auth middleware
app.use(async (req, res, next) => {
  let user = null
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace('Bearer ', '')
    user = await models.user.getUserByToken(token)
  }
  //set user in req object
  req.user = user
  next()
})

const pubsub = new PubSub()

const server = new ApolloServer({
  schema,
  context: async ({ req, res, connection }) => {
    return {
      models,
      pubsub,
      user: req.user // get user from req object, set by auth middleaware
    }
  }
})

server.applyMiddleware({ app });

const port = 3000
app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
)
