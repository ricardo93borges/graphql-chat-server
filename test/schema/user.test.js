import { resolvers } from '../../src/schema/user'

describe('query users', () => {
  it('should get a list of users', async () => {
    const user = {
      id: '1',
      name: 'test'
    }

    const context = {
      user,
      models: {
        user: {
          all: jest.fn(() => [user, user])
        }
      },
    }

    const result = await resolvers.Query.users(null, null, context)
    expect(result.length).toBe(2)
  })
})

describe('mutation createUser', () => {
  it('should create an user', async () => {
    const args = {
      createUserInput: {
        name: 'test',
        email: 'test@email.com',
        password: '123456'
      }
    }

    const context = {
      models: {
        user: {
          findOne: jest.fn(() => null),
          hash: jest.fn(() => 'hash'),
          insert: jest.fn(() => ['1']),
        }
      },
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

    const context = {
      models: {
        user: {
          findOne: jest.fn(() => ({ id: '1' })),
        }
      },
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
