const { queryListReach, queryAddReach } =  require("../models/queryReach.js");

async function reach(req, res, firebase){

    let reach = await new Promise((resolve, reject) => {
        resolve(queryListReach(firebase));
    });

    let response = req.session.response ? req.session.response : [];

    res.render("admin/reach", {response: response, reach: reach})
}

async function addReach(req, res, firebase){
    
    let fields = {
        "pessoas_sensibilizadas": req.body.pessoas_sensibilizadas,
        "negocios_apoiados": req.body.negocios_apoiados,
        "projetos_realizados": req.body.projetos_realizados
    }

    let response = await new Promise((resolve, reject) => {
        resolve(queryAddReach(firebase, fields));
    });

    req.session.response = response;
    res.redirect("/admin/reach")
}

module.exports = {
    reach: reach,
    addReach: addReach
}