'use strict';

const { Model } = require('objection')

class Sheets extends Model {
    static get tableName() {
        return 'sheets'
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                title: { type: 'string' },
                content: { type: 'string' },
                user_id: { type: 'integer' }
            }
        }
    }

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/Users',
                join: {
                    from: 'sheets.user_id',
                    to: 'users.id'
                }
            }
        }
    }
}

module.exports = Sheets