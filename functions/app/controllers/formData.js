const addContact = require('../models/formAdd.js');
const sendEmail = require("../controllers/sendEmail.js")

async function contact(req, res, firebase) {

    let response;

    let fields = {
        "name": req.body.name,
        "email": req.body.email,
        "org": req.body.org != undefined ? req.body.org : "",
        "telefone": req.body.telefone,
        "mensagem": req.body.mensagem,
        "checkbox_lgpd": req.body.checkbox_lgpd,
        "read": false
    }

    response = await new Promise((resolve, reject) => {
        resolve(addContact(firebase, fields));
    });

    sendEmail(req.body);

    req.session.response = response;
    req.session.fields = [];
    res.redirect("/");
}

module.exports = contact