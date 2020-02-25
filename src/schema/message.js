import { gql } from 'apollo-server'

export const subscriptionEnum = Object.freeze({
  MESSAGE_SENT: 'MESSAGE_SENT'
})

export const typeDef = gql`
  extend type Query {
    messages(cursor: String!): [Message!]!
    conversation(cursor: String!, receiverId: ID!): [Message!]!
  }

  extend type Subscription {
    messageSent: Message
  }

  extend type Mutation {
    sendMessage(sendMessageInput: SendMessageInput!): Message!
  }

  type Message {
    id: ID!
    message: String!
    sender: User!
    receiver: User!
  }

  input SendMessageInput {
    message: String!
    receiverId: ID!
  }
`

export const resolvers = {
  Query: {
    messages: async (parent, args, { models, user }, info) => {
      if (!user) { throw new Error('You must be logged in') }

      const { cursor } = args
      const users = await models.user.all()
      const messages = await models.user.getMessages(user.id, cursor)

      const filteredMessages = messages.map(message => {
        const sender = users.find(user => user.id === message.senderId)
        const receiver = users.find(user => user.id === message.receiverId)
        return { ...message, sender, receiver }
      })

      return filteredMessages
    },

    conversation: async (parent, args, { models, user }, info) => {
      if (!user) { throw new Error('You must be logged in') }

      const { cursor, receiverId } = args
      const users = await models.user.all()
      const messages = await models.message.getConversation(user.id, receiverId, cursor)

      const filteredMessages = messages.map(message => {
        const sender = users.find(user => user.id === message.senderId)
        const receiver = users.find(user => user.id === message.receiverId)
        return { ...message, sender, receiver }
      })

      return filteredMessages
    }
  },

  Subscription: {
    messageSent: {
      subscribe: (parent, args, { pubsub, user }, info) => {
        if (!user) { throw new Error('You must be logged in') }

        return pubsub.asyncIterator([subscriptionEnum.MESSAGE_SENT])
      }
    }
  },

  Mutation: {
    sendMessage: async (parent, args, { models, user, pubsub }, info) => {
      if (!user) { throw new Error('You must be logged in') }

      const { message, receiverId } = args.sendMessageInput

      const receiver = await models.user.findById(receiverId)

      if (!receiver) { throw new Error('receiver not found') }

      const result = await models.message.insert([{
        message,
        senderId: user.id,
        receiverId
      }])

      const newMessage = {
        id: result[0],
        message,
        receiver,
        sender: user
      }

      pubsub.publish(subscriptionEnum.MESSAGE_SENT, { messageSent: newMessage })

      return newMessage
    }
  }
}
