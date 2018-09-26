let Todos = require('../handlers/todos')

module.exports = [
    {
        method: 'POST',
        path: '/{id}/todo',
        handler: Todos.create,
        options:{
            auth:'jwt'
        }
    },
    {
        method: 'GET',
        path: '/todos',
        handler: Todos.todos,
    },
    {
        method: 'GET',
        path: '/{id}/todo',
        handler: Todos.todo
    },
    {
        method: 'PATCH',
        path: '/{id}/todo',
        handler:Todos.update,
        options:{
            auth:'jwt'
        }
    },
    {
        method:'DELETE',
        path: '/{id}/todo',
        handler: Todos.delete,
        options:{
            auth:'jwt'
        }
    }
]