import { ApolloServer } from "apollo-server";
import { PubSub } from 'apollo-server'
import { schema } from "./schema";
import models from './model/index'

const pubsub = new PubSub();

const server = new ApolloServer({
  schema,
  context: async ({ req, res, connection }) => {
    return {
      models,
      pubsub,
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});