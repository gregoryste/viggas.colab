const { queryListViggas, queryListAllImgViggas } = require("../models/queryViggas.js");

async function formatterListViggas(firebase){
    let items = await new Promise((resolve, reject) => {
        resolve(queryListViggas(firebase));
    });

    let imgs = await new Promise((resolve, reject) => {
        resolve(queryListAllImgViggas());
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

module.exports = formatterListViggas