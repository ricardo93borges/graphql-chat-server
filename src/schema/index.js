import { merge } from 'lodash'
import { gql, makeExecutableSchema } from 'apollo-server-express'
import {
  typeDef as User,
  resolvers as userResolvers
} from './user'

import {
  typeDef as Message,
  resolvers as messageResolvers
} from './message'

const Query = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  type Subscription {
    _empty: String
  }
`
export const schema = makeExecutableSchema({
  typeDefs: [Query, User, Message],
  resolvers: merge(userResolvers, messageResolvers)
})
