// migrations/20240901000001_add_email_unique_constraint.js

exports.up = function(knex) {
    return knex.schema.alterTable('users', (table) => {
      table.unique('email'); // Adds the unique constraint to the email column
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('users', (table) => {
      table.dropUnique('email'); // Drops the unique constraint from the email column
    });
  };
  