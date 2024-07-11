const { queryAddProduct, queryListProducts, queryUpdateProducts, queryAddTextProduct, queryListTextProducts } = require("../models/queryProducts.js");
const formatterErrors = require("./formatterErrors.js");

async function products(req, res, firebase){

    let text = await new Promise((resolve, reject) => {
        resolve(queryListTextProducts(firebase));
    });

    let products = await new Promise((resolve, reject) => {
        resolve(queryListProducts(firebase));
    });

    let responseProducts = {
        text: text,
        products: products
    }

    let response = req.session.response ? req.session.response : [];

    res.render("admin/products", {response: response, products: responseProducts })
}

async function addTextProducts(req, res, firebase){
    
    let fields = {
        "text": req.body.productsText
    }

    let response = await new Promise((resolve, reject) => {
        resolve(queryAddTextProduct(firebase, fields));
    });

    req.session.response = response;
 
    res.redirect("/admin/products")
}

async function addProducts(req, res, firebase, validationResult){
    
    let products;

    let { errors } = formatterErrors(validationResult(req))

    let fields = {
        "title": req.body.title,
        "subtitle": req.body.subtitle,
        "description": req.body.description,
        "cases": req.body.cases
    }

    let response = {
        "errors": errors,
        "title": "ATENÇÃO!",
        "type": "error"
    }

    // Se tiver algum erro vai exibir a listagem das viggas
    products = await new Promise((resolve, reject) => {
        resolve(queryListProducts(firebase));
    });

    if(errors.length !== 0){
        req.session.response = response;
        req.session.fields = fields;
        req.session.products = products;
        res.redirect("/admin/products")
        return
    }

    response = await new Promise((resolve, reject) => {
        resolve(queryAddProduct(firebase, fields));
    });

    req.session.response = response;
 
    res.redirect("/admin/products")
}

async function setProducts(req, res, firebase){

    let id = req.params.id;

    let text = await new Promise((resolve, reject) => {
        resolve(queryListTextProducts(firebase));
    });

    let products = await new Promise((resolve, reject) => {
        resolve(queryListProducts(firebase));
    });

    let responseProducts = {
        text: text,
        products: products
    }

    let data = await new Promise((resolve, reject) => {
        resolve(queryListProducts(firebase, id));
    });

    let fields = {
        "title": data[0].title,
        "subtitle": data[0].subtitle,
        "description": data[0].description,
        "cases": data[0].cases,
        "id": data[0].id
    }

    let response = req.session.response ? req.session.response : [];

    res.render("admin/products", {response: response, fields: fields, products: responseProducts, update: true})
}

async function editProducts(req, res, firebase, validationResult){

    let products,
    response

    let id = req.params.id;

    let { errors } = formatterErrors(validationResult(req))

    let fields = {
        "title": req.body.title,
        "subtitle": req.body.subtitle,
        "description": req.body.description,
        "cases": req.body.cases,
        "id": id
    }

    response = {
        "errors": errors,
        "title": "ATENÇÃO!",
        "type": "error"
    }

    if(errors.length !== 0){
        req.session.response = response;
        res.redirect(`/admin/products-edit/${id}`)
        return
    }

    await new Promise((resolve, reject) => {
        resolve(queryUpdateProducts(firebase, fields));
    });

    response = {
        "errors": [],
        "title": "Item alterado com sucesso!",
        "type": "success"
    }

    req.session.response = response;
    req.session.fields = [];
    res.redirect("/admin/products")
}

module.exports = {
    addTextProducts: addTextProducts,
    products: products,
    addProducts: addProducts,
    setProducts: setProducts,
    editProducts: editProducts
}