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

  async generateToken (user) {
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
}
