// models/sign_details.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Adjust the path to your database config
const InvoiceDetails = require('./invoice_details');
const SignDetails = sequelize.define('SignDetails', {
  sign_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  is_approved:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  emp_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pr_number: {
    type: DataTypes.STRING, // Adjust the type if needed to match your invoice_id type
    allowNull: false
  },
  sign_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  sign: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
 
}, {
  timestamps: false,
  tableName: 'sign_details'
});


module.exports = SignDetails;
