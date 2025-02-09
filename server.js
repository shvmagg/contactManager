const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const { connect } = require("mongoose");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

connectDb(); 
const app = express();

const port = process.env.PORT || 8000;

// app.use is used to use middleware
app.use(express.json());// to get post request body in json
app.use("/api/contacts", require("./routes/contactRoutes"));// Middle-ware since /api/contacts will be used in all the api calls
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`server runnning on port ${port}`);
});