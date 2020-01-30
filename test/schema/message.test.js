import { resolvers } from '../../src/schema/message'

let user = null
let message = null
let context = null

beforeEach(() => {
  user = {
    id: '1',
    name: 'test',
    email: 'test@email.com',
    password: '123456'
  }

  message = {
    id: '1',
    message: 'lorem ipsum dolor amet',
    senderId: '1',
    receiverId: '2'
  }

  context = {
    user,
    pubsub: {
      publish: jest.fn(() => true)
    },
    models: {
      user: {
        all: jest.fn(() => [user, user]),
        findById: jest.fn(() => user),
        getMessages: jest.fn(() => [message, message])
      },
      message: {
        insert: jest.fn(() => ['1'])
      }
    }
  }
})

describe('Query messages', () => {
  it('should return a list of messages', async () => {
    const result = await resolvers.Query.messages(null, { cursor: '1' }, context)
    expect(context.models.user.all).toHaveBeenCalledTimes(1)
    expect(context.models.user.getMessages).toHaveBeenCalledTimes(1)
    expect(result.length).toBe(2)
  })

  it('should throw an error because user is not logged in', async () => {
    context.user = null

    let error = null
    try {
      await resolvers.Query.messages(null, null, context)
    } catch (err) {
      error = err
    }

    expect(error.message).toBe('You must be logged in')
  })
})

describe('Mutation sendMessage', () => {
  it('should send a message and return it', async () => {
    const args = {
      sendMessageInput: {
        message: 'message',
        receiverId: '2'
      }
    }

    const result = await resolvers.Mutation.sendMessage(null, args, context)

    expect(context.models.user.findById).toHaveBeenCalledTimes(1)
    expect(context.models.message.insert).toHaveBeenCalledTimes(1)
    expect(context.pubsub.publish).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({
      id: '1',
      message: args.sendMessageInput.message,
      receiver: user,
      sender: user
    })
  })

  it('should throw an error because user is not logged in', async () => {
    context.user = null

    let error = null
    try {
      await resolvers.Mutation.sendMessage(null, null, context)
    } catch (err) {
      error = err
    }

    expect(error.message).toBe('You must be logged in')
  })

  it('should throw an error because receiver was not found', async () => {
    context.models.user.findById = jest.fn(() => null)

    const args = {
      sendMessageInput: {
        message: 'message',
        receiverId: '2'
      }
    }

    let error = null
    try {
      await resolvers.Mutation.sendMessage(null, args, context)
    } catch (err) {
      error = err
    }

    expect(context.models.user.findById).toHaveBeenCalledTimes(1)
    expect(error.message).toBe('receiver not found')
  })
})
