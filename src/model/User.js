import Model from './Model'

export class User extends Model {
  constructor (database) {
    super(database, 'user')
  }
}
