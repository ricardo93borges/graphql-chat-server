import { users, messages } from "./data";

export const resolvers = {
  Query: {
    users: () => users,
    messages: (parent, args, context, info) => {
      const { senderId } = args

      let filteredMessages = messages

      if (senderId) {
        filteredMessages = messages.filter(message => message.sender === senderId)
      }

      return filteredMessages.map(message => {
        const sender = users.find(user => user.id === message.sender)
        const receiver = users.find(user => user.id === message.receiver)

        return {
          ...message,
          sender,
          receiver
        }
      })
    },
  },
  Mutation: {
    sendMessage: (parent, args, context, info) => {
      const { message, senderId, receiverId } = args.sendMessageInput
      const id = messages.length + 1

      const sender = users.find(user => user.id === senderId)
      const receiver = users.find(user => user.id === receiverId)

      const newMessage = {
        id,
        message,
        sender,
        receiver
      }

      messages.push(newMessage)

      return newMessage
    },
  }
};