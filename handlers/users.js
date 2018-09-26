const User = require('../models/User')
const bcrypt = require('bcrypt')
const Boom = require('boom')
const uuidv5 = require('uuid/v5')
const NAMESPACE = require('../config').namespace
const SECRET = require('../config').secret
const JWT = require('jsonwebtoken')
const {validatePermission, fetchSession} = require('../utils/userFunctions')
const {generateCurrentTimePlus} = require('../utils/dateFunctions')

const cookie_options = {
    ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
    encoding: 'none',    // we already used JWT to encode
    isSecure: false,      // warm & fuzzy feelings
    isHttpOnly: true,    // prevent client alteration
    clearInvalid: false, // remove invalid cookies
    strictHeader: true   // don't allow violations of RFC 6265
}

exports.users = async function (request, h) {
    try{
        await validatePermission(request, 'admin')

        let users= await User.query().skipUndefined();
        
        if(!users){
            throw Boom.badRequest(`No users found`)
        }
        return users;
    
    }catch(err){
        throw Boom.badRequest(err);

    }
}

exports.authenticate = async (request, h) => {

    try {
        const user = await User.query().findOne({ username: request.payload.username });
        const client = request.redis.client;

        if (!user) {
            throw Boom.badRequest("username is not found");
        }

        const isValid = await bcrypt.compare(request.payload.password, user.password);

        if (!isValid) {
            throw Boom.badRequest("invalid password");
        }

        var session = {
            valid: true,
            id: uuidv5(user.name, NAMESPACE),
            exp: generateCurrentTimePlus(30), // expires in 30 minutes time
            permission: user.permission
        }

        client.set(session.id, JSON.stringify(session));

        const token = JWT.sign(session, SECRET);

        return h.response({ text: 'Check Browser Cookie or Auth Header for your Token (JWT)' })
            .state("token", token, cookie_options)
    } catch (err) {
        throw Boom.badRequest(err);
    }
}

exports.logout = async (request, h) => {
    try {
        let client = request.redis.client;
        let session = fetchSession(client, request);
        session.valid = false;
        client.set(session.id, JSON.stringify(session));

        return h.response({ text: 'You have been logged out' })
            .unstate('token', cookie_options);
    } catch (err) {
        throw Boom.badRequest(err)
    }
}
