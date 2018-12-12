const Todo = require('../models/Todo')
const User = require('../models/Users')
const Boom = require('boom')
const {validatePermission} = require('../utils/userFunctions')

exports.todos = async function (request, h) {
    const todos = await Todo.query()
        .skipUndefined();

    return todos
}

exports.todo = async function (request, h) {
    const todos = await Todo.query()
        .findById(request.params.id)

    if (!todos) {
        throw new createStatusCodeError(404)
    }

    return todos
}

exports.delete = async function (request, h) {

    validatePermission(request)

    await Todo.query()
        .deleteById(request.params.id)

    return "deleted"
}

exports.update = async function (request, h) {

    validatePermission(request)

    const updatedUser = await Todo.query()
        .patchAndFetchById(request.params.id, request.payload)
    return updatedUser;
}


exports.create = async function (request, h) {

    validatePermission(request);
    
    const user = await User.query().findById(request.params.id);

    if (!user) {
        throw Boom.badRequest('invalid user')
    }

    const todo = await user.$relatedQuery('messages').insert(request.payload)

    return todo;
}