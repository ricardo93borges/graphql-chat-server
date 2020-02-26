import Model from './Model'

export class Message extends Model {
  constructor(database) {
    super(database, 'message')
  }

  /**
   * Get messages given sender and receiver IDs
   */
  async getConversation(senderId, receiverId, lastId) {
    return this.database('message')
      .where('id', '>', lastId)
      .andWhere(q => q.whereIn('senderId', [senderId, receiverId])
        .orWhereIn('receiverId', [senderId, receiverId]))
      .limit(10)
  }
}
