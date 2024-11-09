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

  async $beforeInsert(context) {
    await super.$beforeInsert(context);
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);  
    }
  }

  async $beforeUpdate(opt, context) {
    await super.$beforeUpdate(opt, context);
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);  
    }
  }

  // async validatePassword(plainPassword) {
  //   return bcrypt.compare(plainPassword, this.password);  
  // }

  async validatePassword(plainPassword) {
    console.log('Comparing passwords:');
    console.log('Entered Password:', plainPassword);
    console.log('Stored Hashed Password:', this.password);
    const decoded = await bcrypt.compare(plainPassword, this.password);
    console.log('Decoded Password:', decoded);
    return decoded;
  }
  

}

module.exports = Admin;
