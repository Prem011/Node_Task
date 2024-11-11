const { Model } = require('objection');

class User extends Model {
    static get tableName() {
        return 'user'; // Ensure this is the correct table name for users
    }

    static get relationMappings() {
        const Task = require('./Task'); // Adjust path if necessary

        return {
            tasks: {
                relation: Model.HasManyRelation, // A user has many tasks
                modelClass: Task, // Link to the Task model
                join: {
                    from: 'user.id',  // Primary key in the 'user' table
                    to: 'task.user_id' // Foreign key in the 'task' table that points to 'user.id'
                }
            }
        };
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'email', 'mobile'],  // Required fields for creating a user

            properties: {
                id: { type: 'integer' }, // Primary key
                name: { type: 'string' },
                email: { type: 'string', format: 'email' },
                mobile: { type: 'string', minLength: 10, maxLength: 15 },
            }
        };
    }

    static async checkUnique(email, mobile) {
        const userWithEmail = await User.query().findOne({ email });
        if (userWithEmail) {
            throw new Error('Email already exists');
        }

        const userWithMobile = await User.query().findOne({ mobile });
        if (userWithMobile) {
            throw new Error('Mobile number already exists');
        }
    }
}

module.exports = User;
