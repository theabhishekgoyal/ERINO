//Contact.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^\+?[1-9]\d{1,14}$/,
  },
  countryCode: { 
    type: String, 
    required: true 
  },
  company: {
    type: String,
    required: true,
  },
 
  jobTitle: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
