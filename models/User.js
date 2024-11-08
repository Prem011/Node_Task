// models/User.js

const { Model } = require('objection');

class User extends Model {
    static get tableName() {
        return 'users';  
        }

    static get relationMappings() {
        const Task = require('./Task');  

        return {
            tasks: {
                relation: Model.HasManyRelation,  
                modelClass: Task,
                join: {
                    from: 'users.id', 
                    to: 'tasks.user_id'  
                }
            }
        };
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'email', 'mobile'], 

            properties: {
                id: { type: 'integer' },
                email: { type: 'string', format: 'email' }, 
                mobile: { type: 'string', minLength: 10, maxLength: 15 }, 
            }
        };
    }
}

module.exports = User;