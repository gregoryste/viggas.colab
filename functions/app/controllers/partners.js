const formatterErrors = require("./formatterErrors.js");
const { queryAddPartner, queryUpdatePartners, queryDeletePartner, queryListPartners, queryAddTextPartner, queryListTextPartners } = require("../models/queryPartner.js");
const formatterListPartners = require("../controllers/formatterListPartners.js")

async function addPartner(req, res, firebase, validationResult){

    let partners;

    let { errors } = formatterErrors(validationResult(req));

    let response = {
        "errors": errors,
        "title": "ATENÇÃO!",
        "type": "error"
    }

    let fields = {
        "id": "",
        "link": req.body.linkPartners,
        "ordem": req.body.ordem
    }

    if(errors.length !== 0){
        req.session.response = response;
        res.redirect("/admin/partners")
        return
    }

    response = await new Promise((resolve, reject) => {
        resolve(queryAddPartner(firebase, fields, req.files[0]));
    });


    req.session.response = response;
    req.session.partners = partners;
    res.redirect("/admin/partners")
}

async function partner(req, res, firebase){

    let partners = await new Promise((resolve, reject) => {
        resolve(formatterListPartners(firebase));
    });

    let partnerText = await new Promise((resolve, reject) => {
        resolve(queryListTextPartners(firebase));
    });

    let response = req.session.response ? req.session.response : [];

    res.render("admin/partners", {response: response, partners: partners, partnerText: partnerText})
}

async function removePartner(req, res, firebase){

    let id = req.params.id;

    await queryDeletePartner(firebase, id)

    let response = {
        "errors": [],
        "title": "Item deletado com sucesso!",
        "type": "success"
    }

    let partners = await new Promise((resolve, reject) => {
        resolve(queryListPartners(firebase));
    });

    req.session.response = response;
    req.session.partners = partners;
    res.redirect("/admin/partners")
}

async function addPartnerText(req, res, firebase){

    let data;

    data = {
        "text": req.body.partnerText
    }

    let response = await new Promise((resolve, reject) => {
       resolve(queryAddTextPartner(firebase, data));
    });
    
    req.session.response = response;

    res.redirect("/admin/partners")

}

async function setPartners(req, res, firebase){

    let id = req.params.id;

    let partners = await new Promise((resolve, reject) => {
        resolve(formatterListPartners(firebase));
    });

    let partnerText = await new Promise((resolve, reject) => {
        resolve(queryListTextPartners(firebase));
    });

    let data = await new Promise((resolve, reject) => {
        resolve(formatterListPartners(firebase, id));
    });

    let fields = {
        "link": data[0].link,
        "image": data[0].image,
        "id": data[0].id,
        "ordem": data[0].ordem
    }

    let response = req.session.response ? req.session.response : [];

    res.render("admin/partners", {response: response, partners: partners, partnerText: partnerText, fields: fields, update: true})
}

async function editPartners(req, res, firebase){

    let partners,
    response

    let id = req.params.id;

    let fields = {
        "id": id,
        "link": req.body.linkPartners,
        "ordem": req.body.ordem
    }

    await new Promise((resolve, reject) => {
        resolve(queryUpdatePartners(firebase, fields, req.files[0]));
    });

    response = {
        "errors": [],
        "title": "Item alterado com sucesso!",
        "type": "success"
    }

    req.session.response = response;
    req.session.fields = [];
    res.redirect("/admin/partners")
}

module.exports = {
    addPartner: addPartner,
    partner: partner,
    removePartner: removePartner,
    addPartnerText: addPartnerText,
    setPartners: setPartners,
    editPartners: editPartners
}

