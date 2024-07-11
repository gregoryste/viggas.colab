const { Timestamp } = require('firebase-admin/firestore');
const getAllImages = require("../models/getAllImages.js");
const convertPngToWebp = require("../models/convertToWebp.js");

async function queryAddTextCases(firebase, data){
    const db = firebase.firestore();
    const documentRef = db.collection("cases").doc("begin");

    await documentRef.set(data);

    let response = {
        "errors": [],
        "title": "Atualizado com sucesso!",
        "type": "success"
    }

    return response
}

async function queryBeginCases(firebase){
    // Firestore
    let db = firebase.firestore()
    const docRef = db.collection("cases").doc("begin");

    let response = await docRef.get().then(snapshot => {
        if(snapshot.exists){
            return snapshot.data();
        }
        return [];
    })

    return response;
}

async function queryAddCases(firebase, data, file){
    // Firestore
    let db = firebase.firestore();

    data.inclusao = Timestamp.now()

    const addedDocRef = await db.collection("cases").add(data);

    const updatedData = {
        id: addedDocRef.id,
    };

    await addedDocRef.update(updatedData);

    if(file){
        addImage(firebase, addedDocRef.id, await convertPngToWebp(file));
    }

    
    let response = {
        "errors": [],
        "title": "Item adicionado com sucesso!",
        "type": "success"
    }

    return response;
}

async function addImage(firebase, id, file){
    // Create a reference to the destination in Firebase Storage
    const bucket = firebase.storage().bucket();

    let newName = `cases/${id}.webp`;
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

async function queryListCases(firebase, id){
    // Firestore
    let db = firebase.firestore();
    let docRef = db.collection('cases')
    let query;
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

    return response
}

async function queryUpdateCases(firebase, data, file){
    // Firestore
    let db = firebase.firestore()
    const documentRef = db.collection('cases').doc(data.id);

    data.inclusao = Timestamp.now()

    await documentRef.update(data);

    if(file && file.originalname != ""){
        await deleteImage(firebase, data.id);
        await addImage(firebase, data.id, await convertPngToWebp(file));
    }
}

async function deleteImage(firebase, id){
    let bucket = firebase.storage().bucket();

    let nameFile = `cases/${id}.png`

    let result = await new Promise((resolve, reject) => {
        resolve(bucket.file(nameFile).exists());
    });

    result = result.toString();

    if(result.includes("true")){
        await bucket.file(nameFile).delete();
    }
}

async function queryListImgCases(id){
    return await getAllImages(`cases/${id}.png`);
}

async function queryListAllImgCases(){
    return await getAllImages("cases/");
}

async function queryDeleteCases(firebase, id){
    // Firestore
    let db = firebase.firestore()

    let ref = db.collection('cases').doc(id);

    await ref.delete();
    await deleteImage(firebase, id)
}

module.exports = {
    queryAddCases: queryAddCases,
    queryAddTextCases: queryAddTextCases,
    queryBeginCases: queryBeginCases,
    queryListCases: queryListCases,
    queryUpdateCases: queryUpdateCases,
    queryListImgCases: queryListImgCases,
    queryDeleteCases: queryDeleteCases,
    queryListAllImgCases: queryListAllImgCases
}