// routes/invoice.js

const express = require('express');
const crypto = require('crypto');

const { Op } = require('sequelize');

const InvoiceDetails = require('../models/invoice_details');
const SignDetails = require('../models/sign_details');
const AdminDetails = require('../models/admin_details');
const nodemailer = require('nodemailer');

require('dotenv').config();

const router = express.Router();


const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like 'hotmail', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password or app-specific password
  }
});


// POST request to approve an invoice
router.post('/approve', async (req, res) => {
  const { pr_number, email } = req.body;

  try {
    // Find the invoice based on pr_number
    const invoice = await InvoiceDetails.findOne({
      where: { pr_number }
    });

    if (!invoice) {
      return res.status(404).json({ msg: 'Invoice not found' });
    }

    // Determine the position based on the email
    let position;
    if (invoice.requestor_email_id === email) {
      position = 'requestor';
    } else if (invoice.budget_controller === email) {
      position = 'budget_controller';
    } else if (invoice.functional_manager === email) {
      position = 'functional_manager';
    } else if (invoice.department_hod === email) {
      position = 'department_hod';
    } else if (invoice.md === email) {
      position = 'md';
    } else {
      return res.status(400).json({ msg: 'Email does not match any position' });
    }

    // Generate a 64-character encrypted string
    const hash = crypto.createHash('sha256').update(email).digest('hex');
    const signField = hash.slice(0, 64);  // Get first 64 characters

    const currentTime = new Date();

    // Prepare the update object for the current position
    let updateData = {};
    let nextApproverEmail = null;
    switch (position) {
      case 'budget_controller':
        updateData = { budget_controller_sign: signField };
        nextApproverEmail = invoice.functional_manager;
        break;
      case 'functional_manager':
        updateData = { functional_manager_sign: signField };
        nextApproverEmail = invoice.department_hod;
        break;
      case 'department_hod':
        updateData = { department_hod_sign: signField };
        nextApproverEmail = invoice.md;
        break;
      case 'md':
        updateData = { md_sign: signField };
        break;
      default:
        return res.status(400).json({ msg: 'Invalid position' });
    }

    // Update the invoice record
    const [updated] = await InvoiceDetails.update(updateData, {
      where: { pr_number }
    });

    if (updated) {
      // Update or create sign record
      await SignDetails.upsert({
        pr_number,
        emp_id: email, // In this case, email is used as emp_id
        sign_time: currentTime,
        sign: signField,
        email,
        isapproved: true
      });

      // Create a new SignDetails entry for the next approver
      if (nextApproverEmail) {
        await SignDetails.create({
          pr_number,
          emp_id: '',
          sign: '',
          email: nextApproverEmail,
          isapproved: false
        });

        // Send email to the next approver
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: nextApproverEmail,
          subject: `Invoice Details for PR Number: ${pr_number}`,
          text: `Invoice Details:\n
          PR Number: ${pr_number}\n
          PR Sent Date: ${pr_sent_date}\n
          Requestor Email ID: ${requestor_email_id}\n
          Cost Center: ${cost_center}\n
          Supplier Name: ${supplier_name}\n
          Purchase Order Rate Contract: ${purchase_order_rate_contract}\n
          Project Title: ${project_title}\n
          Invoice Proforma Amount Requested: ${invoice_proforma_amount_requested}\n
          Progress Work Completed: ${progress_work_completed}\n
          Taxes: ${taxes}\n
          Net Amount Certified: ${net_amount_certified}\n
          Requestor: ${requestor}\n
          Budget Controller: ${budget_controller}\n
          Functional Manager: ${functional_manager}\n
          Department HOD: ${department_hod}\n
          MD: ${md}`
        };
        await transporter.sendMail(mailOptions);
      }

      res.status(200).json({ msg: 'Invoice signed successfully' });
    } else {
      res.status(404).json({ msg: 'Invoice not found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});





router.get('/invoices', async (req, res) => {
  try {
    const { email_id } = req.query; // Extract email_id from query parameters

    if (!email_id) {
      return res.status(400).json({ message: 'Email ID is required' });
    }

    // Fetch all sign details for the given email_id
    const signDetails = await SignDetails.findAll({
      where: { email: email_id },
      attributes: ['pr_number'] // Only need pr_number for lookup
    });

    // Check if any sign details found
    if (signDetails.length === 0) {
      return res.status(404).json({ message: 'No invoices found for this email ID.' });
    }

    // Extract pr_numbers from sign details
    const prNumbers = signDetails.map(signDetail => signDetail.pr_number);

    // Fetch invoice details using pr_numbers
    const invoices = await InvoiceDetails.findAll({
      where: { pr_number: prNumbers },
      attributes: [
        'pr_number', 'pr_sent_date', 'requestor_email_id', 'cost_center',
        'supplier_name', 'purchase_order_rate_contract', 'project_title',
        'invoice_proforma_amount_requested', 'progress_work_completed',
        'taxes', 'net_amount_certified'
      ]
    });

    // Return the pr_number and invoice details
    const result = invoices.map(invoice => ({
      pr_number: invoice.pr_number,
      invoice: {
        pr_sent_date: invoice.pr_sent_date,
        requestor_email_id: invoice.requestor_email_id,
        cost_center: invoice.cost_center,
        supplier_name: invoice.supplier_name,
        purchase_order_rate_contract: invoice.purchase_order_rate_contract,
        project_title: invoice.project_title,
        invoice_proforma_amount_requested: invoice.invoice_proforma_amount_requested,
        progress_work_completed: invoice.progress_work_completed,
        taxes: invoice.taxes,
        net_amount_certified: invoice.net_amount_certified,
      
      }
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
