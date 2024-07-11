const { Timestamp } = require('firebase-admin/firestore');

async function queryAddProduct(firebase, data){
    // Firestore
    let db = firebase.firestore();

    data.inclusao = Timestamp.now()

    const addedDocRef = await db.collection("products").add(data);

    const updatedData = {
        id: addedDocRef.id,
    };

    await addedDocRef.update(updatedData);
    
    let response = {
        "errors": [],
        "title": "Item adicionado com sucesso!",
        "type": "success"
    }

    return response;
}

async function queryAddTextProduct(firebase, data){
    const db = firebase.firestore();
    const documentRef = db.collection("begin").doc("products");

    await documentRef.set(data);

    let response = {
        "errors": [],
        "title": "Atualizado com sucesso!",
        "type": "success"
    }

    return response
}

async function queryListProducts(firebase, id){
    // Firestore
    let db = firebase.firestore()
    const docRef = db.collection("products");

    const response = [];

    if(id != undefined){
        query = docRef.where('id', '==', id);
    }else {
        query = docRef.orderBy('inclusao')
    }

    await query.get().then(snapshot => {
        snapshot.forEach(doc => {
            response.push(doc.data());
        });
    })

    return response;
}

async function queryListTextProducts(firebase){
    // Firestore
    let db = firebase.firestore()
    const docRef = db.collection("begin").doc("products");

    let response = await docRef.get().then(snapshot => {
        if(snapshot.exists){
            return snapshot.data();
        }
        return [];
    })

    return response;
}

async function queryUpdateProducts(firebase, data){
    // Firestore
    let db = firebase.firestore()

    const documentRef = db.collection('products').doc(data.id);

    await documentRef.update(data)
}

module.exports = {
    queryAddProduct: queryAddProduct,
    queryAddTextProduct: queryAddTextProduct,
    queryListProducts: queryListProducts,
    queryListTextProducts: queryListTextProducts,
    queryUpdateProducts: queryUpdateProducts
}