import database from '../data/db'
import { User } from '../model/User'
import { Message } from '../model/Message'

const user = new User(database)
const message = new Message(database)

const models = {
  user,
  message
}

export default models
