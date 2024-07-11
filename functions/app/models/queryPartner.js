const { Timestamp } = require('firebase-admin/firestore');
const getAllImages = require("../models/getAllImages.js");
const convertPngToWebp = require("../models/convertToWebp.js");

async function queryAddPartner(firebase, data, file){ // file = req
    // Firestore
    let db = firebase.firestore();

    data.inclusao = Timestamp.now()

    const addedDocRef = await db.collection("partners").add(data);

    const updatedData = {
        id: addedDocRef.id,
    };

    await addedDocRef.update(updatedData);

    addImage(firebase, addedDocRef.id, await convertPngToWebp(file));
    
    let response = {
        "errors": [],
        "title": "Item adicionado com sucesso!",
        "type": "success"
    }

    return response;
}

async function queryListPartners(firebase, id){
    // Firestore
    let db = firebase.firestore()
    const docRef = db.collection("partners");

    const response = [];

    if(id != undefined){
        query = docRef.where('id', '==', id);
    }else {
        query = docRef.orderBy('ordem')
    }

    await query.get().then(snapshot => {
        snapshot.forEach(doc => {
            response.push(doc.data());
        });
    })

    return response;
}

async function queryAddTextPartner(firebase, data){
    const db = firebase.firestore();
    const documentRef = db.collection("home").doc("partners");

    await documentRef.set(data);

    let response = {
        "errors": [],
        "title": "Atualizado com sucesso!",
        "type": "success"
    }

    return response
}

async function queryListTextPartners(firebase){
    // Firestore
    let db = firebase.firestore()
    const docRef = db.collection('home').doc("partners");

    return await docRef.get().then((doc) => { 
        if(doc.data()){
            return doc.data().text
        }

        return [];
    })
}

async function queryListAllImgPartners(firebase){
    return await getAllImages("partners/")
}

async function addImage(firebase, id, file){
    // Create a reference to the destination in Firebase Storage
    const bucket = firebase.storage().bucket();

    let newName = `partners/${id}.webp`;
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

async function queryDeletePartner(firebase, id){
    // Firestore
    let db = firebase.firestore()

    let ref = db.collection('partners').doc(id);

    await ref.delete();
    await deleteImage(firebase, id)
}

async function deleteImage(firebase, id){
    let bucket = firebase.storage().bucket();

    let nameFile = `partners/${id}.webp`

    let result = await new Promise((resolve, reject) => {
        resolve(bucket.file(nameFile).exists());
    });

    result = result.toString();

    if(result.includes("true")){
        await bucket.file(nameFile).delete();
    }
}

async function queryUpdatePartners(firebase, data, file){
    // Firestore
    let db = firebase.firestore()
    const documentRef = db.collection('partners').doc(data.id);

    data.inclusao = Timestamp.now()

    await documentRef.update(data);

    if(file && file.originalname != ""){
        await deleteImage(firebase, data.id);
        await addImage(firebase, data.id, await convertPngToWebp(file));
    }
}

module.exports = {
    queryAddPartner: queryAddPartner,
    queryListPartners: queryListPartners,
    queryAddTextPartner: queryAddTextPartner,
    queryListTextPartners: queryListTextPartners,
    queryListAllImgPartners: queryListAllImgPartners,
    queryDeletePartner: queryDeletePartner,
    queryUpdatePartners: queryUpdatePartners
}