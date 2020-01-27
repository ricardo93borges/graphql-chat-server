import knex from 'knex'
import knexfile from '../../knexfile'

const env = process.env.NODE_ENV || 'development'
const configs = knexfile[env]
const database = knex(configs)

export default database
