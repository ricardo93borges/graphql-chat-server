/**
 * @param {import('knex')} knex
 */
exports.up = (knex) =>
  knex.schema.createTable('user', table => {
    table.bigIncrements('id').unsigned();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
  })

/**
 * @param {import('knex')} knex
 */
exports.down = (knex) => knex.schema.dropSchemaIfExists('user')
