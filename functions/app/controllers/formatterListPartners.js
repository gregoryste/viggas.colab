const { queryListPartners, queryListAllImgPartners } = require("../models/queryPartner.js");

async function formatterListPartners(firebase, id = null){

    let items = await new Promise((resolve, reject) => {
        resolve(queryListPartners(firebase, id));
    });

    let imgs = await new Promise((resolve, reject) => {
        resolve(queryListAllImgPartners(firebase));
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

module.exports = formatterListPartners;