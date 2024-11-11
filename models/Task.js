const { Model } = require('objection');

class Task extends Model {
    static get tableName() {
        return 'task'; // Ensure this is the correct table name for tasks
    }

    static get relationMappings() {
        const User = require('./User'); // Adjust path if necessary

        return {
            user: {
                relation: Model.BelongsToOneRelation, // A task belongs to one user
                modelClass: User, // Link to the User model
                join: {
                    from: 'task.user_id', // Foreign key in tasks table
                    to: 'user.id'         // Primary key in users table
                }
            }
        };
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['task_name', 'task_type', 'user_id'],  // 'user_id' is required to link the task to a user

            properties: {
                id: { type: 'integer' },
                task_name: { type: 'string', minLength: 1 },  // The task's name (e.g., "Fix bugs")
                task_type: { type: 'string', enum: ['Pending', 'Done'] },  // Status of the task
                user_id: { type: 'integer' },  // Foreign key linking task to user
            }
        };
    }
}

module.exports = Task;
