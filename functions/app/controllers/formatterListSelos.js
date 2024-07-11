const { queryListSelos, queryListAllImgSelos } = require("../models/querySettings.js");

async function formatterListSelos(firebase){

    let items = await new Promise((resolve, reject) => {
        resolve(queryListSelos(firebase));
    });

    let imgs = await new Promise((resolve, reject) => {
        resolve(queryListAllImgSelos(firebase));
    });

    items.forEach(item => {

        let link = item.link
        let idImage;

        imgs.forEach(i => {
            if(i.url.includes(item.id) == true){
                idImage = i.url;
            }
        })

        item.image = idImage;
        item.link = link;
    })

    return items
}

module.exports = formatterListSelos;