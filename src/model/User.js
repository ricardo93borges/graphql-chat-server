import Model from './Model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class User extends Model {
  constructor (database) {
    super(database, 'user')
  }

  async hash (password) {
    return bcrypt.hash(password, 10)
  }

  async compare (hash, password) {
    return bcrypt.compare(password, hash)
  }

  generateToken (user) {
    /* knex return a RowDataPacket object and jwt.sign function
      expects a plain object, stringify and parse it back does the trick */
    return jwt.sign(
      JSON.parse(JSON.stringify(user)),
      process.env.NODE_ENV,
      {
        expiresIn: 86400
      }
    )
  }

  async getUserByToken (token) {
    try {
      const decoded = jwt.verify(token, process.env.NODE_ENV)
      return decoded
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async getMessages (userId) {
    return this.database('message')
      .where({ senderId: userId })
      .orWhere({ receiverId: userId })
  }
}
