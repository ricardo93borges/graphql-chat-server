export const resolvers = {
  Query: {
    users: async (parent, args, { models }, info) => {
      return await models.user.all()
    },
    messages: async (parent, args, { models }, info) => {
      const { senderId } = args
      const users = await models.user.all();
      let messages = [];

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
    },
  },
  Mutation: {
    sendMessage: async (parent, args, { models }, info) => {
      const { message, senderId, receiverId } = args.sendMessageInput

      const sender = await models.user.findById(senderId)

      if (!sender)
        throw new Error('sender not found')

      const receiver = await models.user.findById(receiverId)

      if (!receiver)
        throw new Error('receiver not found')

      const newMessage = {
        message,
        senderId,
        receiverId
      }

      const result = await models.message.insert([newMessage])

      return {
        id: result[0],
        message,
        sender,
        receiver
      }
    },
  }
};