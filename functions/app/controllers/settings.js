const { add, listSettings, queryAddSelo, queryDeleteSelo } = require("../models/querySettings.js");

async function settings(req, res, firebase){

    let data,
        dataSelo;

    data = {
        "recaptcha": req.body.recaptcha,
        "telefone": req.body.telefone,
        "email": req.body.email,
        "local": req.body.local,
        "instagram": req.body.instagram,
        "facebook": req.body.facebook,
        "linkedin": req.body.linkedin,
        "checkbox_politica_de_privacidade": req.body.checkbox_politica_de_privacidade ? req.body.checkbox_politica_de_privacidade : "",
        "checkbox_codigo_de_conduta": req.body.checkbox_codigo_de_conduta ? req.body.checkbox_codigo_de_conduta : ""
    }

    dataSelo = {
        "id": "",
        "link": req.body.linkSelo,
    }

    let response = await new Promise((resolve, reject) => {
       resolve(add(firebase, data, req.files));
    });

    await new Promise((resolve, reject) => {
        resolve(queryAddSelo(firebase, dataSelo, req.files[4]));
    });

    req.session.response = response;

    data = await new Promise((resolve, reject) => {
        resolve(listSettings(firebase, data));
    });

    res.redirect("/admin/configuracoes")
}

async function removeSelo(req, res, firebase){
    let id = req.params.id;

    await queryDeleteSelo(firebase, id)

    let response = {
        "errors": [],
        "title": "Item deletado com sucesso!",
        "type": "success"
    }

    req.session.response = response;
    res.redirect("/admin/configuracoes")
}

module.exports = {
    settings: settings,
    removeSelo: removeSelo
};