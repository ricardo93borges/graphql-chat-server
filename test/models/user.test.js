import models from '../../src/model'

describe('generateToken', () => {
  it('should generate a token', async () => {
    const user = {
      id: '1',
      name: 'test',
      email: 'test@mail.com',
      password: '123456'
    }

    const token = models.user.generateToken(user)
    const { iat, exp, ...decoded } = await models.user.getUserByToken(token)

    expect(decoded).toMatchObject(user)
  })
})

describe('hash', () => {
  it('should hash a string', async () => {
    const str = 'password'
    const hash = await models.user.hash(str)
    const matched = await models.user.compare(hash, str)
    expect(matched).toBe(true)
  })
})
