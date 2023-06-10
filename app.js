"use strict";

const path = require("path");

const express = require("express");
const dotEnv = require("dotenv");
const morgan = require("morgan");
const passport=require("passport")
const connectDB = require("./config/db");
const blogRoutes = require("./routes/blog");
const dashRoutes = require("./routes/dashboard");
const mongoos=require("mongoose");
const debug=require("debug")("myWeblog")
const fileUpload=require("express-fileupload")
const bodyParser=require("body-parser")
const flash=require("connect-flash");
const session=require("express-session");
const MongoStore=require("connect-mongo")


//load config
dotEnv.config({ path: "./config/config.env" });

//data Base connection
connectDB();

//passport configuration
require("./config/passport")

const app = express();


//body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json())


//file Upload middleware
app.use(fileUpload());


//sessions
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false,
  unset: 'destroy',
  store: MongoStore.create(
     mongoos.connection )

}))



//passport
app.use(passport.initialize());
app.use(passport.session())

//Flash
app.use(flash())//req.flash

//static folder
app.use(express.static(path.join(__dirname, "public")));

// app.use(express.static(path.join(__dirname,process.env.BOOTSTRAP)));
// app.use(express.static(path.join(__dirname,'node_modules','font-awesome')))

// routes
app.use("/", blogRoutes);
app.use("/dashboard", dashRoutes);
app.use("/users", require("./routes/users"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT} ==> ${mongoos}`)
);
