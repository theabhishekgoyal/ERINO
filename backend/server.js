const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const contactsRoutes = require("./routes/Contact.routes");
require("dotenv").config()

const app = express();
app.use(cors());
app.use(bodyParser.json());


// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

app.use("/contacts", contactsRoutes);


app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
