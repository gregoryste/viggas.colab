const getAllImages = require("../models/getAllImages.js");
const { Timestamp } = require('firebase-admin/firestore');
const convertPngToWebp = require("../models/convertToWebp.js");

async function add(firebase, data, files){
    const db = firebase.firestore();
    const documentRef = db.collection("settings").doc("settings");

    await documentRef.set(data);

    if(files[0].originalname && files[0].originalname != ""){
        addImage(firebase, await convertPngToWebp(files[0]), "logo/logo.webp");
    }

    if(files[1].originalname && files[1].originalname != ""){
        addImage(firebase, await convertPngToWebp(files[1]), "logo_footer/logo.webp");
    }

    if(files[2].originalname && files[2].originalname != ""){
        addImage(firebase, await convertPngToWebp(files[2], 100), "img_home/img.webp");
    }

    if(files[3].originalname && files[3].originalname != ""){
        addImage(firebase, files[3], "video_home/video.mp4");
    }

    let response = {
        "errors": [],
        "title": "Atualizado com sucesso!",
        "type": "success"
    }

    return response
}

async function listSettings(firebase){
    // Firestore
    let db = firebase.firestore()
    const docRef = db.collection("settings");

    const settings = [];

    await docRef.get().then(snapshot => {
        snapshot.forEach(doc => {
            settings.push(doc.data());
        });
    })

    // Get Img Logo 
    let logo = await new Promise((resolve, reject) => {
        resolve(queryListImgBrand("logo/"));
    });

    let logo_footer = await new Promise((resolve, reject) => {
        resolve(queryListImgBrand("logo_footer/"));
    });

    let img_home = await new Promise((resolve, reject) => {
        resolve(queryListImgBrand("img_home/"));
    });

    let video_home = await new Promise((resolve, reject) => {
        resolve(queryListImgBrand("video_home/"));
    });

    let response = {
        data: settings,
        logo: logo,
        logo_footer: logo_footer,
        img_home: img_home,
        video_home: video_home
    }

    return response;
}

async function queryListSelos(firebase){
    // Firestore
    let db = firebase.firestore()
    const docRef = db.collection("selos");

    const selos = [];

    await docRef.get().then(snapshot => {
        snapshot.forEach(doc => {
            selos.push(doc.data());
        });
    })

    return selos
}

async function addImage(firebase, file, path){
    // Create a reference to the destination in Firebase Storage
    const bucket = firebase.storage().bucket();

    let newName = `${path}`;
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

async function queryListImgBrand(path){
    let imgs = await getAllImages(path)

    let logos = [];
    
    if(imgs.length > 0){
        imgs.forEach(img => {
            logos.push(img.url);
        });
    }

    return logos;
}

async function queryListAllImgSelos(){
    return await getAllImages("selos/")
}

async function deleteVideo(req, res, firebase){
    let bucket = firebase.storage().bucket();

    let nameFile = `video_home/video.mp4`

    let result = await new Promise((resolve, reject) => {
        resolve(bucket.file(nameFile).exists());
    });

    result = result.toString();

    if(result.includes("true")){
        await bucket.file(nameFile).delete();
    }

    let response = {
        "errors": [],
        "title": "Deletado com sucesso!",
        "type": "success"
    }

    req.session.response = response;

    res.redirect("/admin/configuracoes")
}

async function queryAddSelo(firebase, data, file){ 
    // Firestore
    let db = firebase.firestore();

    data.inclusao = Timestamp.now()

    if (!file || file.originalname == "") {
        return
    }

    const addedDocRef = await db.collection("selos").add(data);

    const updatedData = {
        id: addedDocRef.id,
    };

    await addedDocRef.update(updatedData);

    addImage(firebase, await convertPngToWebp(file), `selos/${addedDocRef.id}.webp`);
}

async function queryDeleteSelo(firebase, id){
    // Firestore
    let db = firebase.firestore()

    let ref = db.collection('selos').doc(id);

    await ref.delete();
    await deleteImage(firebase, id)
}

async function deleteImage(firebase, id){
    let bucket = firebase.storage().bucket();

    let nameFile = `selos/${id}.webp`

    let result = await new Promise((resolve, reject) => {
        resolve(bucket.file(nameFile).exists());
    });

    result = result.toString();

    if(result.includes("true")){
        await bucket.file(nameFile).delete();
    }
}

module.exports = {
    add: add,
    queryAddSelo: queryAddSelo,
    queryListSelos: queryListSelos,
    queryListAllImgSelos: queryListAllImgSelos,
    queryDeleteSelo: queryDeleteSelo,
    listSettings: listSettings,
    deleteVideo: deleteVideo,
}

