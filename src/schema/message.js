import { gql } from 'apollo-server'

export const subscriptionEnum = Object.freeze({
  MESSAGE_SENT: 'MESSAGE_SENT'
})

export const typeDef = gql`
  extend type Query {
    messages(senderId: ID): [Message!]!
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
    senderId: ID!
    receiverId: ID!
  }
`

export const resolvers = {
  Query: {
    messages: async (parent, args, { models }, info) => {
      const { senderId } = args
      const users = await models.user.all()
      let messages = []

      if (senderId) {
        messages = await models.message.find({ senderId })
      } else {
        messages = await models.message.all()
      }

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
      subscribe: (parent, args, { pubsub }, info) => {
        return pubsub.asyncIterator([subscriptionEnum.MESSAGE_SENT])
      }
    }
  },

  Mutation: {
    sendMessage: async (parent, args, { models, pubsub }, info) => {
      const { message, senderId, receiverId } = args.sendMessageInput

      const sender = await models.user.findById(senderId)

      if (!sender) { throw new Error('sender not found') }

      const receiver = await models.user.findById(receiverId)

      if (!receiver) { throw new Error('receiver not found') }

      const result = await models.message.insert([{
        message,
        senderId,
        receiverId
      }])

      const newMessage = {
        id: result[0],
        message,
        sender,
        receiver
      }

      pubsub.publish(subscriptionEnum.MESSAGE_SENT, { messageSent: newMessage })

      return newMessage
    }
  }
}
