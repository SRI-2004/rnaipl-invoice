// models/admin_details.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Assuming you have a database.js file in the config directory for Sequelize instance

const AdminDetails = sequelize.define('AdminDetails', {
  admin_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emp_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  timestamps: false,
  tableName: 'admin_details'
});

module.exports = AdminDetails;
