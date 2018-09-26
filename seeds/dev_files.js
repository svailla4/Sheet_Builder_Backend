const data = require('../data/seed_data')
const { hashPassword } = require('../utils/userFunctions')
const Boom = require('boom')

exports.seed = async function (knex, Promise) {
  // Deletes ALL existing entries
  await Promise.all([
    knex('users').del(),
    knex('todos').del()])

  const users = await Promise.all(data.users.map(async e => {
    try {
      let hash = await hashPassword(e.password)
      e.password = hash;
      return e
    } catch (err) {
      throw Boom.badRequest(err)
    }
  }))

  await Promise.all([
    knex('todos').insert(data.todos),
    knex('users').insert(users)
  ])
};
