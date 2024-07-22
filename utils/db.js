
const sequelize = require('../config/database');

sequelize.sync({ alter: true}) // Use { force: true } to drop existing tables
  .then(() => {
    console.log('Models synchronized with the database.');
  })
  .catch(error => {
    console.error('Unable to sync models with the database:', error);
  });

module.exports = sequelize;
