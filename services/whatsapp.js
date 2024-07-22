require('dotenv').config();
const twilio = require('twilio');

// Function to send WhatsApp message using Twilio
const sendWhatsAppMessage = (employee, messageBody) => {
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
  
    client.messages
      .create({
        body: messageBody,
        from: process.env.TWILIO_WHATSAPP_NO,
        to: `whatsapp:+91${employee.ContactNo}`
      })
      .then(message => console.log(message.sid))
      .catch(error => console.error('Error sending WhatsApp message:', error));
  };

  module.exports = sendWhatsAppMessage;