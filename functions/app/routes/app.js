const express = require("express");
const formatterListPartners = require("../controllers/formatterListPartners.js");
const firebase = require('../models/firebase-admin.js');
const contact = require('../controllers/formData.js');
const { listSettings } = require('../models/querySettings.js');
const { queryBuild } = require("../models/queryBuild.js");
const { queryListTextPartners } = require("../models/queryPartner.js");
const { queryListReach } = require("../models/queryReach.js")
const formatterListSelos = require("../controllers/formatterListSelos.js");
const login = require('../controllers/login.js');
const { check } = require('express-validator');
const cookieParser = require('cookie-parser');

const router = express.Router();
router.use(cookieParser());

async function allSettings(){
   const [
      partners,
      settings,
      build,
      partnerText,
      reach,
      selos
   ] = await Promise.all([
      formatterListPartners(firebase),
      listSettings(firebase),
      queryBuild(firebase),
      queryListTextPartners(firebase),
      queryListReach(firebase),
      formatterListSelos(firebase)
   ])

   return { partners, settings, build, partnerText, reach, selos }
}

// Define variaveis globais para o escopo
router.use(async (req, res, next) => {
   let allConfigs = await new Promise((resolve, reject) => {
      resolve(allSettings());
   });

   res.locals.logo = allConfigs.settings.logo
   res.locals.logo_footer = allConfigs.settings.logo_footer;
   next();
})

router.get("/", async (req, res) => {
   let response = req.session.response ? req.session.response : [];
   let fields = req.session.fields ? req.session.fields : [];

   let allConfigs = await new Promise((resolve, reject) => {
      resolve(allSettings());
   });

   let data = { 
      text: await allConfigs.build,
   }

   res.render("main/index", {
      response: response,
      data: data,
      fields: fields,
      settings: allConfigs.settings,
      partners: allConfigs.partners,
      partnerText: allConfigs.partnerText,
      reach: allConfigs.reach,
      selos: allConfigs.selos
   })
})

// Login

router.post("/login", [
   check("uid", "UID é um campo obrigatório").notEmpty()
],(req, res) => {
   login(req, res, firebase);
})

router.get("/login", (req, res) => {
   let response = req.session.response ? req.session.response : [];
   let fields = req.session.fields ? req.session.fields : [];

   res.render("main/login", {response: response, fields: fields});
})

// Add Contact 

router.post("/add-contact",[
   check("checkbox_lgpd", "Aceite os termos de privacidade").equals('on'),
],(req, res) => {
   contact(req, res, firebase);
})

router.post("/clear-errors", (req, res) => { 
   if(req.session){
      req.session.response = undefined;
   }
})

router.get("/politica-e-privacidade", async (req, res) => {
   let allConfigs = await new Promise((resolve, reject) => {
      resolve(allSettings());
   });

   res.render("main/police-and-privacy", {settings: allConfigs.settings});
})

router.get("/termos-de-uso", async (req, res) => {
   let allConfigs = await new Promise((resolve, reject) => {
      resolve(allSettings());
   });

   res.render("main/terms-of-use", {settings: allConfigs.settings});
})

module.exports = router