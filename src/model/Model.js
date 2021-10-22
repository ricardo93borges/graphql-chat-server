export default class Model {
  _startedDatabase = {};
  
  constructor (database, table) {
    this.database = database
    _startedDatabase = database(table)
  }

  all () {
    return this._startedDatabase.select()
  }

  find (conditions) {
    return this._startedDatabase.where(conditions).select()
  }

  findOne (conditions) {
    return this._startedDatabase.where(conditions).first()
  }

  findById (id) {
    return this._startedDatabase.where({ id }).select().first()
  }

  insert (values) {
    return this._startedDatabase.insert(values)
  }
}
