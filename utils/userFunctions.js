'use strict';
const bcrypt = require('bcrypt')
const Boom = require('boom')
const Users = require('../models/Users')

exports.verifyUniqueUser = async (request, h) => {
    try {
        // Find an entry from the database that
        // matches either the email
        let user = await Users.query().findOne({ email: request.payload.email });

        if (user && user.email == request.payload.email) {
            throw Boom.badRequest("An account with that email already exists");
        }

        return h.response(request.payload);
    } catch (err) {
        throw Boom.badRequest(err);
    }
}

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