import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";

const ContactFormDialog = ({ open, onClose, initialData = null, onSubmit }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    company: "",
    jobTitle: "",
    countryCode: "",
  });

  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [countries, setCountries] = useState([]);
  const [countryChange, setCountryChange] = useState("");

  // Fetch country codes dynamically from an API
  useEffect(() => {
    fetch("https://countrynamewithphonecode.onrender.com/")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);

        if (initialData) {
          setForm(initialData);
          setCountryChange(initialData.countryCode);
        } else {
          resetForm(); 
        }
      });
  }, [initialData]);

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      company: "",
      jobTitle: "",
      countryCode: "",
    });
    setCountryChange("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleCountrycodeChange = (e) => {
    const selectedCountry = e.target.value;
    setCountryChange(selectedCountry);
    const countryData = countries.find((country) => country.name === selectedCountry);

    if (countryData) {
      setForm({ ...form, countryCode: countryData.code });
    } else {
      setForm({ ...form, countryCode: "" });
    }
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const regex = /^\+?[1-9]\d{1,14}$/;
    return regex.test(phone);
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!form.firstName) newErrors.firstName = "First Name is required";
    if (!form.lastName) newErrors.lastName = "Last Name is required";
    if (!form.email || !validateEmail(form.email)) newErrors.email = "Please enter a valid email address";
    const fullPhoneNumber = form.countryCode + form.phoneNumber;
    if (!form.phoneNumber || !validatePhoneNumber(fullPhoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number with country code";
    }
    if (!form.company) newErrors.company = "Company is required";
    if (!form.jobTitle) newErrors.jobTitle = "Job Title is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarOpen(true);
    } else {
      onSubmit(form);
      handleClose(); 
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{initialData ? "Edit Contact" : "Create Contact"}</DialogTitle>
        <DialogContent>
          <Box component="form">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  fullWidth
                  margin="normal"
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  fullWidth
                  margin="normal"
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <FormControl fullWidth margin="normal" error={!!errors.phoneNumber}>
                      <InputLabel>Country Code</InputLabel>
                      <Select
                        name="countryCode"
                        value={countryChange}
                        onChange={handleCountrycodeChange}
                        label="Country Code"
                      >
                        <MenuItem value="">Select a Country</MenuItem>
                        {countries.map((country) => (
                          <MenuItem key={country._id} value={country.name}>
                            {country.code} ({country.name})
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.phoneNumber && <FormHelperText>{errors.phoneNumber}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      label="Phone Number"
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      required
                      fullWidth
                      margin="normal"
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Company"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.company}
                  helperText={errors.company}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Job Title"
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.jobTitle}
                  helperText={errors.jobTitle}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {initialData ? "Save Changes" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactFormDialog;
