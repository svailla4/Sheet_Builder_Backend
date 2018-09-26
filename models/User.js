'use strict';

const {Model} = require('objection')

class User extends Model{
    static get tableName(){
        return 'users'
    }

    static get jsonSchema(){
        return{
            type:'object',
            required:['name','username','password'],
            properties:{
                id:{type:'integer'},
                username:{type:'string'},
                password:{type:'string'},
                permission:{type:'string'},
                name: {type:'string', minLength:1, maxLength:50}
            }
        }
    }

    static get relationMappings(){
        return{
            messages:{
                relation:Model.HasManyRelation,
                modelClass: __dirname +'/Todo',
                join:{
                    from: 'users.id',
                    to: 'todos.userId'
                }
            }
        }
    }
}

module.exports = User