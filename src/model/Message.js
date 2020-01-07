import Model from './Model'

export class Message extends Model {
  constructor(database) {
    super(database, 'message')
  }
}