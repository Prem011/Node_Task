require('dotenv').config();  
const knex = require('knex');
const { Model } = require('objection');

const db = knex({
    client: 'mysql2', 
    connection: {
        host: process.env.DB_HOST, 
        user: process.env.DB_USER, 
        password: process.env.DB_PASSWORD, 
        database: process.env.DB_NAME, 
        charset: 'utf8', 
    },
});

Model.knex(db);

db.raw('SELECT 1')
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err.message);
    });

module.exports = db;
