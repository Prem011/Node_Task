require('dotenv').config(); 
module.exports = {
    client: 'mysql2',  // Use the MySQL2 client for MySQL
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8',
    },
    migrations: {
      directory: './migrations', // Location for migration files
    },
    seeds: {
      directory: './seeds', // Location for seed files
    },
  };
  