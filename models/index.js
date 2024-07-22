const sequelize = require('../config/database');
const AdminDetails = require('./admin_details');
const InvoiceDetails = require('./invoice_details');
const SignDetails = require('./sign_details');



sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Unable to create the database:', err);
  });
