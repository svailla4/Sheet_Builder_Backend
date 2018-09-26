let User = require('../handlers/users')

module.exports = [
    {
        method: 'GET',
        path: '/users',
        handler: User.users,
        options:{
            auth:'jwt'
        }
    },
    {
        method: 'POST',
        path: '/login',
        handler:User.authenticate,
        options:{
            auth:false
        }
    },
    {
        method: ['GET','POST'],
        path: '/logout',
        handler:User.logout,
        options:{
            auth:'jwt'
        }
    }
]