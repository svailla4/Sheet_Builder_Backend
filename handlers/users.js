const Users = require('../models/Users')
const bcrypt = require('bcrypt')
const Boom = require('boom')
const uuidv5 = require('uuid/v5')
const SECRET = require('../config').SECRET
const JWT = require('jsonwebtoken')
const { generateCurrentTimePlus } = require('../utils/dateFunctions')

const cookie_options = {
    ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
    encoding: 'none',    // we already used JWT to encode
    isSecure: false,      // warm & fuzzy feelings
    isHttpOnly: true,    // prevent client alteration
    clearInvalid: false, // remove invalid cookies
    strictHeader: true   // don't allow violations of RFC 6265
}

let createSessionToken = (user) => (
    {
        valid: true,
        id: uuidv5(user.email, SECRET),
        exp: generateCurrentTimePlus(30), // expires in 30 minutes time
        subscription: user.subscription
    }
)

exports.createUser = async function (request, h) {
    try {
        const client = request.redis.client; // get the redis client
        const user = await Users.query()
            .insert({...request.payload, subscription:'freemium', active:true})

        let session = createSessionToken(user);
        client.set(session.id, JSON.stringify(session)); // store the session in redis
        const token = JWT.sign(session, SECRET);

        if (user instanceof Users) {
            return h.response({status:200}).state("token", token, cookie_options);
        } else {
            throw Boom.badRequest("Failed to create account")
        }
    } catch (err) {
        throw Boom.badRequest(err);
    }
}

exports.login = async (request, h) => {

    try {
        const user = await Users.query().findOne({ email: request.payload.email });
        const client = request.redis.client;

        if (!user) {
            throw Boom.badRequest("Invalid email");
        }

        const isValid = await bcrypt.compare(request.payload.password, user.password);

        if (!isValid) {
            throw Boom.badRequest("Invalid password");
        }

        let session = createSessionToken(user);

        client.set(session.id, JSON.stringify(session));

        const token = JWT.sign(session, SECRET);

        return h.response({ status: 200})
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

exports.sheets = async (request,h)=>{
    try{
        let cookieValue = request.state.data;
        return h.response({text:'it_worked'});
    }catch(err){
        throw Boom.badRequest(err);
    }
}
