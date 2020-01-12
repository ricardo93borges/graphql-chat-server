import { gql } from "apollo-server";

export const typeDef = gql`
  extend type Query {
    users: [User!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
  }
`

export const resolvers = {
  Query: {
    users: async (parent, args, { models }, info) => {
      console.log(`here`)
      return await models.user.all()
    },
  }
}