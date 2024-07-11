const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const session = require('express-session')
const path = require('path');
const { Liquid } = require('liquidjs');
const admin = require("./app/routes/admin.js");
const router = require("./app/routes/app.js");
const viggas = require("./app/routes/viggas.js");
const products = require("./app/routes/products.js");
const cases = require("./app/routes/cases.js");
const dotenv = require('dotenv');
require('dotenv').config()

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', express.static(path.join(__dirname, '/app/public')));

const engine = new Liquid({
    extname: ".liquid",
})

app.engine('liquid', engine.express());
app.set("view engine", "liquid");
app.set('views', './app/views');
app.set('views', './app/views');

app.use(
   session({
     secret: 'secret-key',
     resave: false, // Set the appropriate value for resave
     saveUninitialized: true
   })
);

dotenv.config();

app.use("/", router)
app.use("/admin", admin)
app.use("/viggas", viggas)
app.use("/products", products)
app.use("/cases", cases)

exports.viggasColabProd = onRequest(app);