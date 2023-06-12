"use strict";

const path = require("path");

const express = require("express");

const connectDB = require("./config/db");
const blogRoutes = require("./routes/blog");
const dashRoutes = require("./routes/dashboard")
const fileUpload=require("express-fileupload")
const dotEnv = require("dotenv");

//* Load Config
dotEnv.config({ path: "./config/config.env" });

//data Base connection
connectDB();


const app = express();

//body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json())


//file Upload middleware
app.use(fileUpload());


//static folder
app.use(express.static(path.join(__dirname, "public")));

// app.use(express.static(path.join(__dirname,process.env.BOOTSTRAP)));
// app.use(express.static(path.join(__dirname,'node_modules','font-awesome')))

// routes
app.use("/", blogRoutes);
app.use("/dashboard", dashRoutes);
app.use("/users", require("./routes/users"));

//* Error Controller
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} on port`)
);
