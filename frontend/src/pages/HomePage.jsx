import React, { useState, useEffect } from "react";
import { Button, Table, Typography, TableHead, TableBody, TableCell, TableRow, TextField, Box, Grid } from "@mui/material";
import axios from "axios";
import ContactFormDialog from "../components/contactFormDialog";
import ConfirmationDialog from "../components/confirmationDialog";
const URI = "http://localhost:5000";
const HomePage = () => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // Fetch contacts
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = () => {
    axios.get( `${URI}/contacts`).then((response) => {
      setContacts(response.data);
    });
  };

  // Open Dialog
  const handleOpenDialog = (contact = null) => {
    setDialogData(contact);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // Handle Submit (Create or Edit)
  const handleFormSubmit = (formData) => {
    if (dialogData) {
      // Edit existing contact
      axios.put(`${URI}/contacts/${dialogData._id}`, formData).then(() => {
        fetchContacts();
        handleCloseDialog();
      });
    } else {
      // Create new contact
      axios.post(`${URI}/contacts`, formData).then(() => {
        fetchContacts();
        handleCloseDialog();
      });
    }
  };

  // Delete Contact
  const handleDelete = (id) => {
    axios.delete(`${URI}/contacts/${id}`).then(() => {
      setContacts(contacts.filter((contact) => contact._id !== id));
      setIsConfirmOpen(false);
    });
  };

  // Handle Search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle Sort
  const handleSort = () => {
    const sortedContacts = [...contacts].sort((a, b) =>
      sortOrder === "asc"
        ? a.firstName.localeCompare(b.firstName)
        : b.firstName.localeCompare(a.firstName)
    );
    setContacts(sortedContacts);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <Box p={3}>
      <Typography
        variant="h1"
        sx={{
          textAlign: 'center',
          fontFamily: "'Roboto', sans-serif",
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          fontWeight: 'bold',
          color: 'transparent',
          background: 'linear-gradient(45deg, #ff6b81, #ff9f00)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          padding: '20px',
        }}
      >
        Contact Management App
      </Typography>

      <Grid container spacing={2} alignItems="center" justifyContent="space-between" mb={3}>
        <Grid item xs={12} sm={8} md={9}>
          <TextField
            label="Search Contacts"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearch}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3} display="flex" justifyContent="flex-end" alignItems="center">
          <Button
            variant="contained"
            onClick={() => handleOpenDialog()}
            sx={{ mr: 2, width: 'auto' }}
          >
            Create Contact
          </Button>
          <Button variant="contained" onClick={handleSort}>
            Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
          </Button>
        </Grid>
      </Grid>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#3b82f6", color: "#fff" }}>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', color: '#f1f5f9' }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', color: '#f1f5f9' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', color: '#f1f5f9' }}>Phone Number</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', color: '#f1f5f9' }}>Company</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', color: '#f1f5f9' }}>Job Title</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', color: '#f1f5f9' }}>Actions</TableCell>
          </TableRow>

        </TableHead>
        <TableBody>
          {contacts
            .filter(
              (contact) =>
                contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.phoneNumber.includes(searchQuery)
            )
            .map((contact) => (
              <TableRow key={contact._id}>
                <TableCell>{contact.firstName + " " + contact.lastName}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.countryCode + " " + contact.phoneNumber}</TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>{contact.jobTitle}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenDialog(contact)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setSelectedContact(contact);
                      setIsConfirmOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* Create/Edit Contact Dialog */}
      <ContactFormDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        initialData={dialogData}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Dialog */}
      {isConfirmOpen && selectedContact && (
        <ConfirmationDialog
          open={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={() => handleDelete(selectedContact._id)}
          title="Delete Contact"
          message={`Are you sure you want to delete ${selectedContact.firstName}'s contact?`}
        />
      )}
    </Box>
  );
};

export default HomePage;
