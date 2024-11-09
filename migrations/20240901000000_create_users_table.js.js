// migrations/20240901000000_create_users_table.js

exports.up = function(knex) {
    return knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.string('mobile').notNullable();
      table.timestamps(true, true); // Adds created_at and updated_at columns
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
  };
  