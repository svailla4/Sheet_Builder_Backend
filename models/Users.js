'use strict';

const { Model } = require('objection')

class Users extends Model {
    static get tableName() {
        return 'users'
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                password: { type: 'string' },
                email: { type: 'string' },
                subscription: { type: 'string' },
                active: {type: 'boolean'},
                registration_token: {type:'string'}
            }
        }
    }

    static get relationMappings() {
        return {
            sheets: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + '/Sheets',
                join: {
                    from: 'users.id',
                    to: 'sheets.user_id'
                }
            }
        }
    }
}

module.exports = Users