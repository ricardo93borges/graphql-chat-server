import { gql } from 'apollo-server'

export const typeDef = gql`
  extend type Query {
    users: [User!]!
  }

  extend type Mutation {
    createUser(createUserInput: CreateUserInput!): User!
    login(email: String!, password: String!): String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
  }
`

export const resolvers = {
  Query: {
    users: async (parent, args, { models, user }, info) => {
      if (!user) { throw new Error('You must be logged in') }

      const users = await models.user.all()
      return users
    }
  },

  Mutation: {
    createUser: async (parent, args, { models }, info) => {
      const { name, email, password } = args.createUserInput
      const user = await models.user.findOne({ email })

      if (user) { throw new Error('Email already taken') }

      const hash = await models.user.hash(password)

      const result = await models.user.insert([{
        name,
        email,
        password: hash
      }])

      return {
        id: result[0],
        password: hash,
        name,
        email
      }
    },

    login: async (parent, args, { models }, info) => {
      const { email, password } = args

      const user = await models.user.findOne({ email })

      if (!user) { throw new Error('Invalid credentials') }

      if (!await models.user.compare(user.password, password)) { throw new Error('Invalid credentials') }

      return models.user.generateToken(user)
    }
  }
}
