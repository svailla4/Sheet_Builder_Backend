const bcrypt = require('bcrypt')
const Boom = require('boom')
const { generateCurrentTimePlus } = require('../utils/dateFunctions')
const Hoek = require('hoek')


exports.hashPassword = (password) =>
    new Promise((resolve, reject) =>
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                reject(err)
            }
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(hash)
                }
            })
        })
    )


exports.fetchSession = async (client, request) => {
    try {
        let redisreply = await client.get(request.auth.credentials.id);
        return JSON.parse(redisreply);
    } catch (err) {
        throw Boom.badRequest(err)
    }
}

exports.validatePermission = async (request, permission = 'user') => {
    try {
        let client = request.redis.client;
        let redisreply = await client.get(request.auth.credentials.id);
        let session = JSON.parse(redisreply);

        if (session.permission !== permission) {
            throw Boom.unauthorized()
        }

        return true

    } catch (err) {
        throw Boom.badRequest(err);
    }
}