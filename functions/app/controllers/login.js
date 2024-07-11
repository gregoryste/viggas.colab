const { validationResult } = require('express-validator');
const formatterErrors = require("./formatterErrors.js");
const queryLogin = require("../models/queryLogin.js");

async function login(req, res, firebase){

    let response, data;

    let { errors } = formatterErrors(validationResult(req))

    response = {
      "errors": errors,
      "title": "ATENÇÃO!",
      "type": "error"
    }

    if(errors.length !== 0){
        req.session.response = response;
        req.session.fields = fields;
        res.redirect("/login")
        return
    }

    data = {
      "uid": req.body.uid,
    }

    response = await new Promise((resolve, reject) => {
      resolve(queryLogin(res, req, firebase, data));
    });

    if(response){
      res.cookie('__session', req.body.uid);
    }

    res.redirect("/admin");
}

module.exports = login