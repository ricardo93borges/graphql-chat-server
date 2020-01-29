import { resolvers } from '../../src/schema/user'

let user = null
let context = null

beforeEach(() => {
  user = {
    id: '1',
    name: 'test',
    email: 'test@email.com',
    password: '123456'
  }

  context = {
    user,
    models: {
      user: {
        all: jest.fn(() => [user, user]),
        findOne: jest.fn(() => user),
        hash: jest.fn(() => 'hash'),
        insert: jest.fn(() => ['1']),
        compare: jest.fn(() => true),
        generateToken: jest.fn(() => ['token'])
      }
    }
  }
})

describe('query users', () => {
  it('should get a list of users', async () => {
    const result = await resolvers.Query.users(null, null, context)
    expect(result.length).toBe(2)
  })
})

describe('mutation createUser', () => {
  it('should create an user', async () => {
    context.models.user.findOne = jest.fn(() => null)

    const args = {
      createUserInput: {
        ...user
      }
    }

    const result = await resolvers.Mutation.createUser(null, args, context)

    expect(context.models.user.findOne).toHaveBeenCalledTimes(1)
    expect(context.models.user.hash).toHaveBeenCalledTimes(1)
    expect(context.models.user.insert).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({
      ...args.createUserInput,
      id: '1',
      password: 'hash'
    })
  })

  it('should throw an error bacause email is already taken', async () => {
    const args = {
      createUserInput: {
        name: 'test',
        email: 'test@email.com',
        password: '123456'
      }
    }

    let error = null
    try {
      await resolvers.Mutation.createUser(null, args, context)
    } catch (err) {
      error = err
    }

    expect(context.models.user.findOne).toHaveBeenCalledTimes(1)
    expect(error.message).toBe('Email already taken')
  })
})

describe('mutation login', () => {
  it('should generate a token', async () => {
    const token = 'token'
    const args = { ...user }
    const result = await resolvers.Mutation.login(null, args, context)

    expect(context.models.user.findOne).toHaveBeenCalledTimes(1)
    expect(context.models.user.compare).toHaveBeenCalledTimes(1)
    expect(context.models.user.generateToken).toHaveBeenCalledTimes(1)
    expect(result[0]).toBe(token)
  })

  it('should throw an error because a user with given email was not found', async () => {
    const args = { ...user }
    context.models.user.findOne = jest.fn(() => null)

    let error = null
    try {
      await resolvers.Mutation.login(null, args, context)
    } catch (err) {
      error = err
    }

    expect(context.models.user.findOne).toHaveBeenCalledTimes(1)
    expect(error.message).toBe('Invalid credentials')
  })
})
