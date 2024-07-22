const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package
const invoiceRouter = require('./routes/invoices');
const adminRouter = require('./routes/admin');
const signRouter = require('./routes/sign');
const db = require('./utils/db'); // Import the db.js file

const {requestLogger} = require('./utils/middleware');
require('dotenv').config();

// Create Express app
const app = express();

// Use the CORS middleware
const corsOptions = {
  origin: '*', // Allow all origins (you can restrict this to specific origins)
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'], // Allow specific methods
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept','Authorization'] // Allow specific headers
};

app.use(cors(corsOptions));


// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use('/admin', adminRouter);
app.use('/invoice', invoiceRouter);
app.use('/sign', signRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
