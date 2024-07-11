const formatterErrors = require("./formatterErrors.js");
const { queryAddViggas, queryDeleteViggas, queryListViggas, queryUpdateViggas, queryListImgViggas, queryUpdateImgViggas } = require("../models/queryViggas.js")


async function add(req, res, firebase, validationResult){

    let viggas;

    let { errors } = formatterErrors(validationResult(req))

    let fields = {
        "id": "",
        "name": req.body.name,
        "function": req.body.function,
        "formation": req.body.formation,
        "exp": req.body.exp,
        "ordem": req.body.ordem,
        "inclusao": ""
    }

    let response = {
        "errors": errors,
        "title": "ATENÇÃO!",
        "type": "error"
    }

    // Se tiver algum erro vai exibir a listagem das viggas
    viggas = await new Promise((resolve, reject) => {
        resolve(queryListViggas(firebase));
    });

    if(errors.length !== 0){
        req.session.response = response;
        req.session.fields = fields;
        req.session.viggas = viggas;
        res.redirect("/admin/viggas")
        return
    }

    response = await new Promise((resolve, reject) => {
        resolve(queryAddViggas(firebase, fields, req.files[0]));
    });

    // Se nao tiver nenhum error, vai exibir a listagem das viggas atualizada
    viggas = await new Promise((resolve, reject) => {
        resolve(queryListViggas(firebase));
    });

    req.session.response = response;
    req.session.fields = [];
    req.session.viggas = viggas;
    res.redirect("/admin/viggas")
}

async function list(req, res, firebase){

    let viggas = await new Promise((resolve, reject) => {
        resolve(queryListViggas(firebase));
    });

    let response = req.session.response ? req.session.response : [];
    let fields = req.session.fields ? req.session.fields : [];

    res.render("admin/carousel", {response: response, fields: fields, viggas: viggas})
}

async function set(req, res, firebase){

    let imgResponse;

    let id = req.params.id;

    let viggas = await new Promise((resolve, reject) => {
        resolve(queryListViggas(firebase));
    });

    let data = await new Promise((resolve, reject) => {
        resolve(queryListViggas(firebase, id));
    });

    let imgUrl = await new Promise((resolve, reject) => {
        resolve(queryListImgViggas(id));
    });

    if(imgUrl.length == 0){
        imgResponse = []
    }else {
        imgResponse = imgUrl[0].url
    }

    let fields = {
        "id": data[0].id,
        "name": data[0].name,
        "img": imgResponse,
        "function": data[0].function,
        "formation": data[0].formation,
        "exp": data[0].exp,
        "ordem": data[0].ordem
    }

    res.render("admin/carousel", {response: {}, fields: fields, viggas: viggas, update: true})
}

async function edit(req, res, firebase, validationResult){
    
    let viggas,
        response,
        img;
    
    let id = req.params.id;

    let { errors } = formatterErrors(validationResult(req))

    let fields = {
        "id": id,
        "name": req.body.name,
        "function": req.body.function,
        "formation": req.body.formation,
        "exp": req.body.exp,
        "ordem": req.body.ordem,
    }

    response = {
        "errors": errors,
        "title": "ATENÇÃO!",
        "type": "error"
    }

    // Se tiver algum erro vai exibir a listagem das viggas
    viggas = await new Promise((resolve, reject) => {
        resolve(queryListViggas(firebase));
    });

    if(errors.length !== 0){
        req.session.response = response;
        req.session.fields = fields;
        req.session.viggas = viggas;
        res.redirect("/admin/viggas")
        return
    }

    response = await new Promise((resolve, reject) => {
        resolve(queryUpdateViggas(firebase, fields));
    });

    if(req.files[0].originalname != ""){
        img = await new Promise((resolve, reject) => {
            resolve(queryUpdateImgViggas(firebase, id, req.files[0]));
        });
    }

    response = {
        "errors": [],
        "title": "Item alterado com sucesso!",
        "type": "success"
    }

    req.session.response = response;
    req.session.fields = [];
    req.session.viggas = viggas;
    res.redirect("/admin/viggas")
}

async function remove(req, res, firebase){

    let id = req.params.id;

    queryDeleteViggas(firebase, id)

    let response = {
        "errors": [],
        "title": "Item deletado com sucesso!",
        "type": "success"
    }

    let viggas = await new Promise((resolve, reject) => {
        resolve(queryListViggas(firebase));
    });

    req.session.response = response;
    req.session.fields = [];
    req.session.viggas = viggas;
    res.redirect("/admin/viggas")
}

module.exports = {
    add: add,
    list: list, 
    set: set,
    edit: edit,
    remove: remove
}

