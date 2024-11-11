const { Model } = require('objection');
const bcrypt = require('bcrypt');

class Admin extends Model {
  static get tableName() {
    return 'admin'; 
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'email', 'password'],  

      properties: {
        id: { type: 'integer' },
        username: { type: 'string', minLength: 3, maxLength: 50 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 } 
      }
    };
  }

}

module.exports = Admin;
