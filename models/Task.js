const { Model } = require('objection');

class Task extends Model {
    static get tableName() {
        return 'task'; // Ensure this is the actual table name
    }

    static get relationMappings() {
        const User = require('./User'); // Adjust path if necessary

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'task.user_id',  // Changed 'tasks' to 'task'
                    to: 'user.id'         // Assuming 'users' is the correct table name
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
