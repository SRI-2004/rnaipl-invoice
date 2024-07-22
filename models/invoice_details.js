// models/invoice_details.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Assuming you have a database.js file in the config directory for Sequelize instance
const SignDetails = require('./sign_details');

const InvoiceDetails = sequelize.define('InvoiceDetails', {
  pr_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  pr_sent_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  requestor_email_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cost_center: {
    type: DataTypes.STRING,
    allowNull: false
  },
  supplier_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  purchase_order_rate_contract: {
    type: DataTypes.STRING,
    allowNull: false
  },
  project_title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  invoice_proforma_amount_requested: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  progress_work_completed: {
    type: DataTypes.STRING,
    allowNull: false
  },
  taxes: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  net_amount_certified: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  requestor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  requestor_sign: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  budget_controller: {
    type: DataTypes.STRING,
    allowNull: false
  },
  budget_controller_sign: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  functional_manager: {
    type: DataTypes.STRING,
    allowNull: false
  },
  functional_manager_sign: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  department_hod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department_hod_sign: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  md: {
    type: DataTypes.STRING,
    allowNull: false
  },
  md_sign: {
    type: DataTypes.STRING(64),
    allowNull: true
  },

}, {
  timestamps: false,
 
  tableName: 'invoice_details'
});


module.exports = InvoiceDetails;
