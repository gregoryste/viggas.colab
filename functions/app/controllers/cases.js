const { queryBeginCases, queryAddTextCases, queryAddCases, queryListCases, queryUpdateCases, queryListImgCases, queryDeleteCases } = require("../models/queryCases.js");
const formatterErrors = require("./formatterErrors.js");

async function cases(req, res, firebase){

    let text = await new Promise((resolve, reject) => {
        resolve(queryBeginCases(firebase));
    });

    let cases = await new Promise((resolve, reject) => {
        resolve(queryListCases(firebase));
    });

    let response = req.session.response ? req.session.response : [];

    res.render("admin/cases", {response: response, begin: text, cases: cases })
}

async function setCasesText(req, res, firebase){

    let fields = {
        "text": req.body.casesText
    }

    let response = await new Promise((resolve, reject) => {
        resolve(queryAddTextCases(firebase, fields));
    });

    req.session.response = response;
 
    res.redirect("/admin/cases")
}

async function addCases(req, res, firebase, validationResult){

    let { errors } = formatterErrors(validationResult(req))

    let fields = {
        "title": req.body.title,
        "subtitle": req.body.subtitle,
        "description": req.body.description,
        "video": req.body.video,
        "link": req.body.link,
        "ordem": req.body.ordem
    }

    let response = {
        "errors": errors,
        "title": "ATENÇÃO!",
        "type": "error"
    }

    if(errors.length !== 0){
        req.session.response = response;
        req.session.fields = fields;
        res.redirect("/admin/cases")
        return
    }

    response = await new Promise((resolve, reject) => {
        resolve(queryAddCases(firebase, fields, req.files[0]));
    });

    req.session.response = response;
    req.session.fields = [];
    res.redirect("/admin/cases")
}

async function editCases(req, res, firebase, validationResult){
    
    let cases,
        response,
        img;
    
    let id = req.params.id;

    let { errors } = formatterErrors(validationResult(req))

    let fields = {
        "id": id,
        "title": req.body.title,
        "subtitle": req.body.subtitle,
        "description": req.body.description,
        "video": req.body.video,
        "link": req.body.link,
        "ordem": req.body.ordem
    }

    response = {
        "errors": errors,
        "title": "ATENÇÃO!",
        "type": "error"
    }

    if(errors.length !== 0){
        req.session.response = response;
        req.session.fields = fields;
        res.redirect(`/admin/cases/${id}`)
        return
    }

    await new Promise((resolve, reject) => {
        resolve(queryUpdateCases(firebase, fields, req.files[0]));
    });

    response = {
        "errors": [],
        "title": "Item alterado com sucesso!",
        "type": "success"
    }

    req.session.response = response;
    req.session.fields = [];
    res.redirect("/admin/cases")
}

async function setCases(req, res, firebase){

    let imgResponse;

    let id = req.params.id;

    let cases = await new Promise((resolve, reject) => {
        resolve(queryListCases(firebase));
    });

    let data = await new Promise((resolve, reject) => {
        resolve(queryListCases(firebase, id));
    });

    let imgUrl = await new Promise((resolve, reject) => {
        resolve(queryListImgCases(id));
    });

    if(imgUrl.length == 0){
        imgResponse = []
    }else {
        imgResponse = imgUrl[0].url
    }

    let fields = {
        "id": data[0].id,
        "title": data[0].title,
        "subtitle": data[0].subtitle,
        "description": data[0].description,
        "video": data[0].video,
        "link": data[0].link,
        "ordem": data[0].ordem,
        "imagem": imgResponse
    }

    res.render("admin/cases", {response: {}, fields: fields, cases: cases, update: true})
}

async function removeCases(req, res, firebase){

    let id = req.params.id;

    await queryDeleteCases(firebase, id)

    let response = {
        "errors": [],
        "title": "Item deletado com sucesso!",
        "type": "success"
    }

    req.session.response = response;
    req.session.fields = [];
    res.redirect("/admin/cases")
}

module.exports = {
    cases: cases,
    setCasesText: setCasesText,
    addCases: addCases,
    editCases: editCases,
    setCases: setCases,
    removeCases: removeCases
}