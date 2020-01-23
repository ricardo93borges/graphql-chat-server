
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
        {
          id: '1',
          name: 'Meryl Silverburgh',
          email: 'meryl@mgs.com',
          password: 'kojima'
        },
        {
          id: '2',
          name: 'Solid Snake',
          email: 'snake@mgs.com',
          password: 'kojima'
        }
      ])
    })
}
