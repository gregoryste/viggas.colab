const { list } = require("firebase/storage");
const { add, queryBuild } = require("../models/queryBuild.js");

async function build(req, res, firebase){

    let data;

    data = {
        "text": req.body.buildText
    }

    let response = await new Promise((resolve, reject) => {
       resolve(add(firebase, data));
    });

    data = await new Promise((resolve, reject) => {
        resolve(queryBuild(firebase));
    });
    
    req.session.response = response;
    req.session.fields = data;

    res.redirect("/admin/build")
}

async function listBuild(req, res, firebase){
    
    let home = await new Promise((resolve, reject) => {
        resolve(queryBuild(firebase));
    });

    let fields = {
        text: home
    }

    let response = req.session.response ? req.session.response : [];

    res.render("admin/build", {response: response, fields: fields})
}

module.exports = {
    build: build,
    listBuild: listBuild
}