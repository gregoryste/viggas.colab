// const { getFirestore, doc, setDoc, getDoc } = require("firebase/firestore");

async function add(firebase, data){
    const db = firebase.firestore();
    const documentRef = db.collection("home").doc("build");

    await documentRef.set(data);

    let response = {
        "errors": [],
        "title": "Atualizado com sucesso!",
        "type": "success"
    }

    return response
}

async function queryBuild(firebase){
    // Firestore
    let db = firebase.firestore()
    const docRef = db.collection('home').doc("build");

    return await docRef.get().then((doc) => {
        if(doc.data()){
            return doc.data().text
        }

        return [];
    })
}

module.exports = {
    add: add,
    queryBuild: queryBuild
}