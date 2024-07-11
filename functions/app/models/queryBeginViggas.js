const getAllImages = require("../models/getAllImages.js");
const convertPngToWebp = require("../models/convertToWebp.js");

async function queryAddBeginViggas(firebase, data, file){
    const db = firebase.firestore();
    const documentRef = db.collection("begin").doc("begin");

    await documentRef.set(data);

    if(file.originalname && file.originalname != ""){
        addImage(firebase, await convertPngToWebp(file));
    }

    let response = {
        "errors": [],
        "title": "Item adicionado com sucesso!",
        "type": "success"
    }

    return response;
}

async function queryListBeginViggas(firebase){
    // Firestore
    let db = firebase.firestore()
    const docRef = db.collection("begin");

    const begin = [];

    await docRef.get().then(snapshot => {
        snapshot.forEach(doc => {
            begin.push(doc.data());
        });
    })

    // Get Img Viggas 
    let imgUrl = await new Promise((resolve, reject) => {
        resolve(queryListImg());
    });

    imgUrl = imgUrl == [] ? imgUrl : imgUrl[0].url;
    
    let response = {
        data: begin,
        img: imgUrl
    }

    return response;
}

async function addImage(firebase, file){
    // Create a reference to the destination in Firebase Storage
    const bucket = firebase.storage().bucket();

    let newName = `viggasPage/viggasPage.webp`;
    const fileRef = bucket.file(newName);

    if (!file || file.originalname == "") {
        return
    }

    // Upload the file to Firebase Storage
    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });
}

async function queryListImg(){
    return await getAllImages("viggasPage/")
}

module.exports = {
    queryAddBeginViggas: queryAddBeginViggas,
    queryListBeginViggas: queryListBeginViggas
}