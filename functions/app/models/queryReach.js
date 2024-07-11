const { getFirestore, collection, doc, setDoc, getDocs, query } = require("firebase/firestore");

async function queryAddReach(firebase, data){
    // Firestore
    const db = firebase.firestore();
    const documentRef = db.collection("alcance").doc("alcance");

    await documentRef.set(data)

    let response = {
        "errors": [],
        "title": "Item adicionado com sucesso!",
        "type": "success"
    }

    return response;
}

async function queryListReach(firebase){
    // Firestore
    let db = firebase.firestore()
    const docRef = db.collection("alcance");

    const dataArray = [];

    await docRef.get().then(snapshot => {
        snapshot.forEach(doc => {
            dataArray.push(doc.data());
        });
    })

    return dataArray
}

module.exports = {
    queryAddReach: queryAddReach,
    queryListReach: queryListReach
}