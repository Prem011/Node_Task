const { Model } = require('objection');

class Task extends Model {
    static get tableName() {
        return 'tasks'; 
    }

    static get relationMappings() {
        const User = require('./User');  

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'tasks.user_id',  
                    to: 'users.id'  
                }
            }
        };
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['task_name', 'task_type', 'user_id'],  

            properties: {
                id: { type: 'integer' },
                task_name: { type: 'string', minLength: 1 },  
                task_type: { type: 'string', enum: ['Pending', 'Done'] }, 
                user_id: { type: 'integer' },  
            }
        };
    }
}

module.exports = Task;
