// models/User.js
const { Model } = require('objection');
const { hashPassword, comparePassword } = require('../utils/bcrypt');

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
            required: ['name', 'email', 'mobile', 'password'], // Added 'password' as required

            properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                email: { type: 'string', format: 'email' },
                mobile: { type: 'string', minLength: 10, maxLength: 15 },
                password: { type: 'string', minLength: 6 } // Ensure password is stored as a hash
            }
        };
    }

    // Hash the password before saving a new user
    async $beforeInsert(context) {
        await super.$beforeInsert(context);
        if (this.password) {
            this.password = await hashPassword(this.password);
        }
    }

    // Hash the password before updating the user (if password is provided)
    async $beforeUpdate(opt, context) {
        await super.$beforeUpdate(opt, context);
        if (this.password) {
            this.password = await hashPassword(this.password);
        }
    }

    // Validate password method for comparing entered password with the hash
    async validatePassword(plainPassword) {
        return comparePassword(plainPassword, this.password);
    }
}

module.exports = User;
