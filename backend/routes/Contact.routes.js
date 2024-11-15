const express = require("express");
const {
  createContact,
  getAllContacts,
  updateContact,
  deleteContact,
} = require("../controllers/Contact.controllers")

const router = express.Router();

router.post("/", createContact);        // Create a new contact
router.get("/", getAllContacts);       // Get all contacts
router.put("/:id", updateContact);     // Update a contact
router.delete("/:id", deleteContact);  // Delete a contact

module.exports = router;
