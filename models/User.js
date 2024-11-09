const { Model } = require('objection');

class User extends Model {
    static get tableName() {
        return 'user';
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
                name: { type: 'string' },
                email: { type: 'string', format: 'email' },
                mobile: { type: 'string', minLength: 10, maxLength: 15 }
                
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
