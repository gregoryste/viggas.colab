const { list, update } = require("../models/queryContact.js");
const formatDate = require("../public/js/formatDate.js");

async function contact(req, res, firebase){

    let response, data;

    let contact = await new Promise((resolve, reject) => {
        resolve(list(firebase));
    });

    contact.map(item => item.inclusao = formatDate(item.inclusao))

    data = {
        "contact": contact
    }

    response = req.session.response ? req.session.response : [];

    res.render("admin/contact", {response: response, data: data})
}

async function read(req, res, firebase){

    let data;
    let id = req.params.id

    let response = await new Promise((resolve, reject) => {
        resolve(update(firebase, id));
    });
 
    let contact = await new Promise((resolve, reject) => {
        resolve(list(firebase));
    });
 
    contact.map(item => item.inclusao = formatDate(item.inclusao))
 
    data = {
        "contact": contact
    }
    
    req.session.response = response;

    res.redirect("/admin/contato")
}

module.exports = {
    contact: contact,
    read: read,
}


