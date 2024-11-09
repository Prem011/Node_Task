// migrations/20240901000002_add_mobile_unique_constraint.js

exports.up = function(knex) {
    return knex.schema.alterTable('users', (table) => {
      table.unique('mobile'); // Adds the unique constraint to the mobile column
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('users', (table) => {
      table.dropUnique('mobile'); // Drops the unique constraint from the mobile column
    });
  };
  