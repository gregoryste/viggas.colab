const express = require("express");
const firebase = require('../models/firebase-admin.js');
const { listSettings } = require('../models/querySettings.js');
const { queryListProducts, queryListTextProducts } = require("../models/queryProducts.js");
const products = express.Router();

async function settings(){
   let settings = await new Promise((resolve, reject) => {
      resolve(listSettings(firebase));
   });

   return settings
}

async function dataProduct(){
   let products = await new Promise((resolve, reject) => {
      resolve(queryListProducts(firebase));
   });

   let text = await new Promise((resolve, reject) => {
      resolve(queryListTextProducts(firebase));
   });

   return [products, text]
}

// Products and Services
products.get("/", async (req, res) => {
   let response = req.session.response ? req.session.response : [];

   res.render("main/products", {
      response: response,
      page: "products",
      products: await dataProduct(),
      settings: await settings(),
   })
})

module.exports = products;