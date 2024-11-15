const Contact = require("../models/Contact");

const createContact = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, countryCode, company, jobTitle } = req.body;

  // Email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  // Clean up countryCode (remove spaces) and validate
  const cleanedCountryCode = countryCode.replace(/\s+/g, '');

  // Combine countryCode and phoneNumber
  const fullPhoneNumber = `${cleanedCountryCode}${phoneNumber}`;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  // Validate phone number and country code
  if (!phoneNumber || !cleanedCountryCode || !phoneRegex.test(fullPhoneNumber)) {
    return res.status(400).json({ error: "Please enter a valid phone number with country code." });
  }

  try {
    const contact = new Contact({ firstName, lastName, email, phoneNumber, countryCode: cleanedCountryCode, company, jobTitle });
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all contacts
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a contact
const updateContact = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    countryCode,
    company,
    jobTitle,
  } = req.body;

  // Validate email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  // Clean up and validate country code and phone number
  const cleanedCountryCode = countryCode ? countryCode.replace(/\s+/g, '') : '';
  const fullPhoneNumber = `${cleanedCountryCode}${phoneNumber}`;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  if (!phoneNumber || !cleanedCountryCode || !phoneRegex.test(fullPhoneNumber)) {
    return res.status(400).json({
      error: "Please enter a valid phone number with a country code.",
    });
  }

  // Validate required fields
  if (!firstName || !lastName) {
    return res.status(400).json({
      error: "First name and last name are required.",
    });
  }

  try {
    // Update the contact
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email,
        phoneNumber,
        countryCode: cleanedCountryCode,
        company,
        jobTitle,
      },
      { new: true } // Return the updated document
    );

    if (!contact) {
      return res.status(404).json({ error: "Contact not found." });
    }

    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: "An error occurred while updating the contact." });
  }
};


// Delete a contact
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found." });
    }
    res.json({ message: "Contact deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  updateContact,
  deleteContact,
};
