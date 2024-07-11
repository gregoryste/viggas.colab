const express = require("express");
const formatterListViggas = require('../controllers/formatterListViggas.js');
const firebase = require('../models/firebase-admin.js');
const { listSettings } = require('../models/querySettings.js');
const { queryListBeginViggas } = require("../models/queryBeginViggas.js");

const viggas = express.Router();

async function settings(){
    let settings = await new Promise((resolve, reject) => {
       resolve(listSettings(firebase));
    });
 
    return settings
}

async function begin(){
    let begin = await new Promise((resolve, reject) => {
       resolve(queryListBeginViggas(firebase));
    });
 
    return begin
}

async function users(){
    let users = await new Promise((resolve, reject) => {
       resolve(formatterListViggas(firebase));
    });
 
    return users
}

// Viggas 

viggas.get("/", async (req, res) => {
    let response = req.session.response ? req.session.response : [];
 
    res.render("main/viggas", {
       settings: await settings(),
       response: response,
       page: "viggas", 
       begin: await begin(),
       viggas: await users(),
    });
 })

module.exports = viggas;