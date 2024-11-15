import React, { useState, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
// const URI = "https://erino-s1ss.vercel.app";
const URI = 'http://localhost:5000'
const EditContactForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    countryCode: "",
    company: "",
    jobTitle: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    countryCode: "",
  });

  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    axios
      .get(`${URI}/contacts/${id}`)
      .then((response) => {
        setForm(response.data);
      })
      .catch((err) => console.error("Error fetching contact:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "countryCode" ? value.trim() : value,
    });
    setIsFormChanged(true);
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const regex = /^\+?[1-9]\d{1,14}$/;
    return regex.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let valid = true;
    const newErrors = {
      email: "",
      phoneNumber: "",
      firstName: "",
      lastName: "",
      countryCode: "",
    };

    // Validate email
    if (!form.email || !validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    // Validate phone number
    if (!form.phoneNumber || !validatePhoneNumber(form.phoneNumber)) {
      newErrors.phoneNumber =
        "Please enter a valid phone number with country code.";
      valid = false;
    }

    // Validate country code
    const cleanedCountryCode = form.countryCode.trim();
    if (!cleanedCountryCode) {
      newErrors.countryCode = "Country code is required.";
      valid = false;
    }

    // Validate required fields
    if (!form.firstName) {
      newErrors.firstName = "First name is required.";
      valid = false;
    }

    if (!form.lastName) {
      newErrors.lastName = "Last name is required.";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      axios
        .put(`${URI}/contacts/${id}`, {
          ...form,
          countryCode: cleanedCountryCode, 
        })
        .then(() => navigate("/"))
        .catch((err) => console.error("Error updating contact:", err));
    }
  };

  return (
    <Box p={3}>
      <h2>Edit Contact</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          error={Boolean(errors.firstName)}
          helperText={errors.firstName}
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          error={Boolean(errors.lastName)}
          helperText={errors.lastName}
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          error={Boolean(errors.phoneNumber)}
          helperText={errors.phoneNumber}
        />
        <TextField
          label="Country Code"
          name="countryCode"
          value={form.countryCode}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          error={Boolean(errors.countryCode)}
          helperText={errors.countryCode}
        />
        <TextField
          label="Company"
          name="company"
          value={form.company}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Job Title"
          name="jobTitle"
          value={form.jobTitle}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" fullWidth>
          Save Changes
        </Button>
      </form>
    </Box>
  );
};

export default EditContactForm;
