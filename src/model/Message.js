import Model from './Model'

export class Message extends Model {
  constructor (database) {
    super(database, 'message')
  }

  async getConversation (senderId, receiverId, lastId) {
    return this.database('message')
      .where('id', '>', lastId)
      .andWhere({ senderId })
      .andWhere({ receiverId })
      .limit(10)
  }
}
