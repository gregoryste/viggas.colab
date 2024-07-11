const { queryListBeginViggas, queryAddBeginViggas } = require("../models/queryBeginViggas.js");

async function beginViggas(req, res, firebase){

    let begin = await new Promise((resolve, reject) => {
        resolve(queryListBeginViggas(firebase));
    });

    let response = req.session.response ? req.session.response : [];

    res.render("admin/viggas", {response: response, begin: begin})
}

async function addBeginViggas(req, res, firebase){
    
    let fields = {
        "text": req.body.viggasText
    }

    let response = await new Promise((resolve, reject) => {
        resolve(queryAddBeginViggas(firebase, fields, req.files[0]));
    });

    req.session.response = response;
 
    res.redirect("/admin/viggas-page")
}

module.exports = {
    beginViggas: beginViggas,
    addBeginViggas: addBeginViggas
}