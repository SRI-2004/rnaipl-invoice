const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminDetails  = require('../models/admin_details');
require('dotenv').config();

const router = express.Router();

// Sign up
router.post('/signup', async (req, res) => {
  const { name,emp_id, email, contact, department, position, password } = req.body;

  try {
    // Check if user already exists
    // let admin = await AdminDetails.findOne({ where: { email } });
    // if (admin) {
    //   return res.status(400).json({ msg: 'Admin already exists' });
    // }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    admin = await AdminDetails.create({
      name,
      emp_id,
      email,
      contact,
      department,
      position,
      password: hashedPassword
    });

  
    const payload = {
      admin: {
        emp_id: admin.emp_id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let admin = await AdminDetails.findOne({ where: { email } });
    if (!admin) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Generate JWT
    const payload = {
      admin: {
        emp_id: admin.emp_id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, position: admin.position , email: admin.email , emp_id: admin.emp_id , contact: admin.contact , department: admin.department , name: admin.name });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all admins
router.get('/all', async (req, res) => {
  try {
    const admins = await AdminDetails.findAll({
      attributes: ['email', 'position']  // Assuming 'position' is the name field here
    });
    res.json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
