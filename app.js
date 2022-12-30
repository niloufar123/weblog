"use strict";

const path = require("path");

const express = require("express");
const layouts = require("express-ejs-layouts");
const dotEnv = require("dotenv");
const morgan = require("morgan");

const connectDB = require("./config/db");
const blogRoutes = require("./routes/blog");
const dashRoutes = require("./routes/dashboard");

//load config
dotEnv.config({ path: "./config/config.env" });

//data Base connection
connectDB();

const app = express();
//loging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//view Engine
app.use(layouts);
app.set("view engine", "ejs");
app.set("views", "views");
app.set("layout", "./layouts/mainLayout");

//body parser
app.use(express.urlencoded({ extended: false }));

//static folder
app.use(express.static(path.join(__dirname, "public")));

// app.use(express.static(path.join(__dirname,process.env.BOOTSTRAP)));
// app.use(express.static(path.join(__dirname,'node_modules','font-awesome')))

// routes
app.use("/", blogRoutes);
app.use("/dashboard", dashRoutes);
app.use("/users", require("./routes/users"));
//404 page
app.use((req, res) => {
  res.render("404", { pageTitle: "404 page not found", path: "/404" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
