const { Timestamp } = require('firebase-admin/firestore');
const getAllImages = require("../models/getAllImages.js");
const convertPngToWebp = require("../models/convertToWebp.js");
const dotenv = require('dotenv');
dotenv.config();

async function queryAddViggas(firebase, data, file){
    // Firestore
    let db = firebase.firestore();

    data.inclusao = Timestamp.now()

    const addedDocRef = await db.collection("viggas").add(data);

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

async function queryDeleteViggas(firebase, id){
    // Firestore
    let db = firebase.firestore()

    let ref = db.collection('viggas').doc(id);

    await ref.delete();
    await deleteImage(firebase, id)
}

async function queryListViggas(firebase, id){
    // Firestore
    let db = firebase.firestore();
    let docRef = db.collection('viggas')
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

async function queryUpdateViggas(firebase, data){
    // Firestore
    let db = firebase.firestore()
    const documentRef = db.collection('viggas').doc(data.id);

    data.inclusao = Timestamp.now()

    await documentRef.update(data)
}

async function queryUpdateImgViggas(firebase, id, file){

    await deleteImage(firebase, id);

    addImage(firebase, id, await convertPngToWebp(file));
}

async function queryListImgViggas(id){
    return await getAllImages(`viggas/${id}.png`);
}

async function queryListAllImgViggas(){
    return await getAllImages("viggas/");
}

async function addImage(firebase, id, file){

    // Create a reference to the destination in Firebase Storage
    const bucket = firebase.storage().bucket();

    let newName = `viggas/${id}.webp`;
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

async function findImage(firebase, id){
    // Storage
    let storage = getStorage(firebase);
    let refStorage = ref(storage, "viggas/");
    
    let itemSelect;

    await listAll(refStorage).then(response => {
        response.items.forEach(item => {
            if(item.name.includes(id) == true){
                itemSelect = item
            }
        })
    })

    return itemSelect
}

async function deleteImage(firebase, id){
    let bucket = firebase.storage().bucket();

    let nameFile = `viggas/${id}.webp`

    let result = await new Promise((resolve, reject) => {
        resolve(bucket.file(nameFile).exists());
    });

    result = result.toString();

    if(result.includes("true")){
        await bucket.file(nameFile).delete();
    }
}

module.exports = {
    queryAddViggas: queryAddViggas,
    queryDeleteViggas: queryDeleteViggas,
    queryListViggas: queryListViggas,
    queryUpdateViggas: queryUpdateViggas,
    queryUpdateImgViggas: queryUpdateImgViggas,
    queryListImgViggas: queryListImgViggas,
    queryListAllImgViggas: queryListAllImgViggas
}