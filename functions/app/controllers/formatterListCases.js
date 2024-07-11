const { queryListCases, queryListAllImgCases } = require("../models/queryCases.js");

async function formatterListCases(firebase){
    let items = await new Promise((resolve, reject) => {
        resolve(queryListCases(firebase));
    });

    let imgs = await new Promise((resolve, reject) => {
        resolve(queryListAllImgCases());
    });

    items.forEach(item => {

        let idImage = "";

        imgs.forEach(i => {
            if(i.url.includes(item.id) == true){
                idImage = i.url;
            }
        })

        item.image = idImage;
    })

    return items
}

module.exports = formatterListCases;