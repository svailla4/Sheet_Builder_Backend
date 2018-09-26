'use strict';

const {Model} = require('objection')

class Todo extends Model{
    static get tableName(){
        return 'todos'
    }

    static get jsonSchema(){
        return{
            type:'object',
            properties:{
                id:{type:'integer'},
                userId:{type:'integer'},
                message: {type:'string', minLength:1, maxLength:50}
            }
        }
    }

    static get relationMappings(){
        return{
            user:{
                relation:Model.BelongsToOneRelation,
                modelClass: __dirname +'/User',
                join:{
                    from: 'todos.userId',
                    to: 'users.id'
                }
            }
        }
    }
}

module.exports = Todo