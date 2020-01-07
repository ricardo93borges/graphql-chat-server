/**
 * @param {import('knex')} knex
 */
exports.up = (knex) =>
  knex.schema.createTable('message', table => {
    table.bigIncrements('id').unsigned();
    table.string('message').notNullable();
    table.bigInteger('senderId').unsigned().references('id').inTable('user');
    table.bigInteger('receiverId').unsigned().references('id').inTable('user');
  })

/**
 * @param {import('knex')} knex
 */
exports.down = function (knex) {
  knex.schema.dropSchemaIfExists('message')
};
