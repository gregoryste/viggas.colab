const express = require("express");
const fileParser = require('express-multipart-file-parser');
const { validationResult } = require('express-validator');
const firebase = require('../models/firebase-admin.js');
const { add, set, list, remove, edit } = require('../controllers/viggas.js');
const { partner, addPartner, setPartners, editPartners, removePartner, addPartnerText } = require('../controllers/partners.js');
const formatterListSelos = require('../controllers/formatterListSelos.js');
const { contact, read } = require('../controllers/contact.js');
const { settings, removeSelo  } = require('../controllers/settings.js');
const { build, listBuild } = require("../controllers/build.js");
const { reach, addReach } = require("../controllers/reach.js");
const { beginViggas, addBeginViggas } = require("../controllers/beginViggas.js");
const { products, setProducts, editProducts, addProducts, addTextProducts } = require("../controllers/products.js");
const { cases, setCasesText, setCases, addCases, editCases, removeCases } = require("../controllers/cases.js");
const { listSettings, deleteVideo } = require("../models/querySettings.js");
const authMiddleware = require('../models/validateLogin.js');
const { check } = require('express-validator');
const cookieParser = require('cookie-parser');

const admin = express.Router();
admin.use(cookieParser());
admin.use(fileParser);

// Apply authMiddleware to all routes in the admin router
admin.use(authMiddleware);

// Configuracoes
async function configuracoes(){
    let config = await new Promise((resolve, reject) => {
        resolve(listSettings(firebase));
    });

    return config
}

// Define variaveis globais para o escopo
admin.use(async (req, res, next) => {
    res.locals.config = await configuracoes();
    next();
})

// Configuracoes

admin.get("/", async (req, res) => {
    res.render("main/admin", {response: {}, fields: {}})
})

// Viggas

admin.get("/viggas", (req, res) => {
    list(req, res, firebase)
})

admin.post("/viggas", [ //  upload.single("img"),
    check("name", "Nome é um campo obrigatório").notEmpty(),
    check("function", "Função é um campo obrigatório").notEmpty(),
    check("img").custom((value, { req }) => {
        if (req.files[0].originalname == "") {
            throw new Error('Imagem é um campo obrigatório.');
        }
        return true;
      })
], (req, res) => {
    add(req, res, firebase, validationResult)
})

admin.get("/viggas-edit/:id", (req,res) => {
    set(req, res, firebase)
})

admin.post("/viggas-edit/:id", [ //  upload.single("img"),
    check("name", "Nome é um campo obrigatório").notEmpty(),
    check("function", "Função é um campo obrigatório").notEmpty()
], (req,res) => {
    edit(req, res, firebase, validationResult)
})

admin.get("/viggas-delete/:id", (req,res) => {
    remove(req, res, firebase)
})

// Home 
admin.get("/build", (req, res) => {
    listBuild(req, res, firebase)
})

admin.post("/build", (req, res) => {
    build(req, res, firebase)
})

// Contato

admin.get("/contato", (req, res) => {
    contact(req, res, firebase)
})


admin.get("/contact-read/:id", (req, res) => {
    read(req, res, firebase)
})

admin.get("/configuracoes", async (req, res) => {
    let response = req.session.response ? req.session.response : [];


    res.render("admin/settings", {
        response: response,
        settings: await configuracoes(),
        selos: await formatterListSelos(firebase)
    }
    )
})

admin.get("/configuracoes/delete-video", async (req, res) => {
    deleteVideo(req, res, firebase);
})

admin.post("/configuracoes", (req, res) => {
    settings(req, res, firebase);
})

admin.get("/selo-delete/:id", (req,res) => {
    removeSelo(req, res, firebase)
})

// Carousel Partners
admin.get("/partners", (req, res) => {
    partner(req, res, firebase);
})

admin.post("/partners",[ 
    check("img-partner").custom((value, { req }) => {
        if (req.files[0].originalname == "") {
            throw new Error('Imagem é um campo obrigatório.');
        }
        return true;
    })
], (req, res) => {
    addPartner(req, res, firebase, validationResult)
})

admin.get("/partners-edit/:id", (req,res) => {
    setPartners(req, res, firebase)
})

admin.post("/partners-edit/:id", (req,res) => {
    editPartners(req, res, firebase)
})

admin.get("/partners-delete/:id", (req,res) => {
    removePartner(req, res, firebase)
})

admin.post("/partners-text", (req, res) => {
    addPartnerText(req, res, firebase)
})

// Alcance

admin.get("/reach", (req, res) => {
    reach(req, res, firebase);
})

admin.post("/reach", (req, res) => {
    addReach(req, res, firebase)
})

// Viggas Page
admin.get("/viggas-page", (req, res) => {
    beginViggas(req, res, firebase)
})

admin.post("/viggas-page",  (req, res) => { // upload.single("img-viggas-page"),
    addBeginViggas(req, res, firebase);
})

// Produtos
admin.get("/products", (req, res) => {
    products(req, res, firebase)
})

admin.post("/products-add", [
    check("title", "Título é um campo obrigatório").notEmpty(),
    check("subtitle", "Subtítulo é um campo obrigatório").notEmpty(),
    check("description", "Descrição é um campo obrigatório").notEmpty(),
    check("cases", "Casos é um campo obrigatório").notEmpty(),
], (req, res) => { 
    addProducts(req, res, firebase, validationResult);
})

admin.get("/products-edit/:id", (req,res) => {
    setProducts(req, res, firebase)
})

admin.post("/products-edit/:id", [ 
    check("title", "Título é um campo obrigatório").notEmpty(),
    check("subtitle", "Subtítulo é um campo obrigatório").notEmpty(),
    check("description", "Descrição é um campo obrigatório").notEmpty(),
    check("cases", "Casos é um campo obrigatório").notEmpty(),
], (req,res) => {
    editProducts(req, res, firebase, validationResult)
})

admin.post("/products-text",  (req, res) => { 
    addTextProducts(req, res, firebase);
})

admin.post("/clear-errors", (req, res) => {
    if(req.session){
        req.session.destroy();
    }
 })

// cases

admin.get("/cases", (req, res) => {
    cases(req, res, firebase)
})

admin.post("/cases-add", [
    check("subtitle", "Subtítulo é um campo obrigatório").notEmpty(),
    check("description", "Descrição é um campo obrigatório").notEmpty(),
    check("ordem", "Ordem é um campo obrigatório").notEmpty(),
], (req, res) => { 
    addCases(req, res, firebase, validationResult);
})

admin.post("/cases", (req, res) => {
    setCasesText(req, res, firebase)
})

admin.get("/cases-edit/:id", (req,res) => {
    setCases(req, res, firebase)
})

admin.post("/cases-edit/:id", [ 
    check("subtitle", "Subtítulo é um campo obrigatório").notEmpty(),
    check("description", "Descrição é um campo obrigatório").notEmpty(),
    check("ordem", "Ordem é um campo obrigatório").notEmpty(),
], (req,res) => {
    editCases(req, res, firebase, validationResult)
})

admin.get("/cases-delete/:id", (req,res) => {
    removeCases(req, res, firebase)
})

module.exports = admin;