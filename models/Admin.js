// models/Admin.js
const { Model } = require('objection');
const bcrypt = require('bcrypt');

class Admin extends Model {
  static get tableName() {
    return 'admins';  // Name of the table in your database
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'email', 'password'],  // Password is required

      properties: {
        id: { type: 'integer' },
        username: { type: 'string', minLength: 3, maxLength: 50 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 }  // Password must be at least 6 characters
      }
    };
  }

  // Hash the password before saving the admin
  async $beforeInsert(context) {
    await super.$beforeInsert(context);
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);  // Hash password with salt rounds
    }
  }

  // Hash the password before updating the admin (if password is provided)
  async $beforeUpdate(opt, context) {
    await super.$beforeUpdate(opt, context);
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);  // Hash password with salt rounds
    }
  }

  // Validate password method for comparing entered password with the hash
  async validatePassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);  // Compare plain password with hashed password
  }
}

module.exports = Admin;
