const express = require("express");
const firebase = require('../models/firebase-admin.js');
const { listSettings } = require('../models/querySettings.js');
const { queryBeginCases } = require("../models/queryCases.js");
const formatterListCases = require("../controllers/formatterListCases.js");
const dotenv = require('dotenv');
dotenv.config();

const cases = express.Router();

async function settings(){
    let settings = await new Promise((resolve, reject) => {
       resolve(listSettings(firebase));
    });
 
    return settings
}

async function begin(){
   let begin = await new Promise((resolve, reject) => {
      resolve(queryBeginCases(firebase));
   });

   return begin
}

// cases

async function getCases(){
   let cases = await new Promise((resolve, reject) => {
      resolve(formatterListCases(firebase));
   });

   return cases
}

cases.get("/", async (req, res) => {
    let response = req.session.response ? req.session.response : [];
 
    res.render("main/cases", {
       settings: await settings(),
       response: response,
       begin: await begin(),
       cases: await getCases(),
       page: "cases", 
       apiKey: process.env.API_YOUTUBE,
    });
 })

module.exports = cases;