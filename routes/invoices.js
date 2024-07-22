// routes/invoice.js

const express = require('express');
const InvoiceDetails = require('../models/invoice_details');
require('dotenv').config();
const SignDetails = require('../models/sign_details');
const { Op } = require('sequelize'); // Add this line at the top
const nodemailer = require('nodemailer');
const router = express.Router();


const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like 'hotmail', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password or app-specific password
  }
});


router.post('/create', async (req, res) => {
  const {
    pr_number,
    pr_sent_date,
    requestor_email_id,
    cost_center,
    supplier_name,
    purchase_order_rate_contract,
    project_title,
    invoice_proforma_amount_requested,
    progress_work_completed,
    taxes,
    net_amount_certified,
    requestor,
    budget_controller,
    functional_manager,
    department_hod,
    md
  } = req.body;

  try {
    // Create new invoice
    const invoice = await InvoiceDetails.create({
      pr_number,
      pr_sent_date,
      requestor_email_id,
      cost_center,
      supplier_name,
      purchase_order_rate_contract,
      project_title,
      invoice_proforma_amount_requested,
      progress_work_completed,
      taxes,
      net_amount_certified,
      requestor,
      budget_controller,
      functional_manager,
      department_hod,
      md
    });

    // Insert into SignDetails table
    await SignDetails.bulkCreate([
      { pr_number, emp_id: '', sign: '', email: requestor, isapproved: false },
      { pr_number, emp_id: '', sign: '', email: budget_controller, isapproved: false },
    ]);

    // Email content for requestor and budget_controller
    const recipients = [requestor, budget_controller];
    for (const recipient of recipients) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
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

      // Send email
      await transporter.sendMail(mailOptions);
    }

    res.status(201).json(invoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});




router.get('/all', async (req, res) => {
  try {
    const invoices = await InvoiceDetails.findAll({
      attributes: [
        'pr_number',
        'pr_sent_date',
        'requestor_email_id',
        'cost_center',
        'supplier_name',
        'purchase_order_rate_contract',
        'project_title',
        'invoice_proforma_amount_requested',
        'progress_work_completed',
        'taxes',
        'net_amount_certified',
        'requestor',
        'budget_controller',
        'functional_manager',
        'department_hod',
        'md'
      ]
    });
    res.json(invoices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/signed', async (req, res) => {
  try {
    const signedInvoices = await InvoiceDetails.findAll({
      where: {
        requestor_sign: { [Op.ne]: null },
        budget_controller_sign: { [Op.ne]: null },
        functional_manager_sign: { [Op.ne]: null },
        department_hod_sign: { [Op.ne]: null },
        md_sign: { [Op.ne]: null }
      },
      attributes: [
        'pr_number',
        'pr_sent_date',
        'requestor_email_id',
        'cost_center',
        'supplier_name',
        'purchase_order_rate_contract',
        'project_title',
        'invoice_proforma_amount_requested',
        'progress_work_completed',
        'taxes',
        'net_amount_certified',
        'requestor',
        'budget_controller',
        'functional_manager',
        'department_hod',
        'md',
        'requestor_sign',
        'budget_controller_sign',
        'functional_manager_sign',
        'department_hod_sign',
        'md_sign'
      ]
    });
    res.json(signedInvoices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



// GET request to specify who has signed the invoice till now
router.get('/signed', async (req, res) => {
  const { pr_number } = req.query;

  try {
    // Fetch the sign details for the given pr_number
    const signDetails = await SignDetails.findAll({
      where: { pr_number }
    });

    if (signDetails.length === 0) {
      return res.status(404).json({ msg: 'No sign details found for this PR number.' });
    }

    // Fetch the corresponding invoice details to get the email to position mapping
    const invoice = await InvoiceDetails.findOne({
      where: { pr_number }
    });

    if (!invoice) {
      return res.status(404).json({ msg: 'Invoice not found for this PR number.' });
    }

    // Map emails to positions
    const positionMap = {
      requestor: invoice.requestor,
      budget_controller: invoice.budget_controller,
      functional_manager: invoice.functional_manager,
      department_hod: invoice.department_hod,
      md: invoice.md
    };

    // Determine if each position has signed the invoice
    const signedStatus = {};
    for (const [position, email] of Object.entries(positionMap)) {
      const signDetail = signDetails.find(detail => detail.email === email);
      signedStatus[position] = signDetail ? !!signDetail.sign : false;
    }

    res.status(200).json(signedStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
