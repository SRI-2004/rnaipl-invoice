
const chalk = require('chalk');

const { Sequelize } = require('sequelize');
require('dotenv').config();
// config/database.js
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: 5432, // Default port for PostgreSQL
    logging: (msg) => console.log(chalk.blue(`[DB QUERY] ${msg}`)), 
    dialectOptions: {
        ssl: {
            require: true, // Optional: require SSL connection
            rejectUnauthorized: false // Optional: disable rejecting unauthorized SSL certificates
        }
    }
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

module.exports = sequelize;

