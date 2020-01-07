
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('message').del()
    .then(function () {
      // Inserts seed entries
      return knex('message').insert([
        {
          id: '1',
          message: 'Any family?',
          senderId: '1',
          receiverId: '2'
        },
        {
          id: '2',
          message: 'No, but I was raised by many people.',
          senderId: '2',
          receiverId: '1'
        },
        {
          id: '3',
          message: 'Is there anyone you like?',
          senderId: '1',
          receiverId: '2'
        },
        {
          id: '4',
          message: "I've never been interested in anyone else's life...",
          senderId: '2',
          receiverId: '1'
        },
        {
          id: '5',
          message: 'So you are all alone. Just like Mantis said...',
          senderId: '1',
          receiverId: '2'
        },
        {
          id: '6',
          message: "Other people just complicate my life. I don't like to get involved.",
          senderId: '2',
          receiverId: '1'
        },
        {
          id: '7',
          message: "...You're a sad, lonely man.",
          senderId: '1',
          receiverId: '2'
        },
      ]);
    });
};
