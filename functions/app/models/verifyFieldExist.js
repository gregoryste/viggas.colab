const { getFirestore, collection, getDocs, query, where } = require("firebase/firestore");

async function verifyFieldExist(firebase, colecao, field, data){
    let response;
    // Firestore
    let db = getFirestore(firebase)
    let newColecao = collection(db, colecao);

    let q = query(newColecao, where(`${field}`, "==", `${data}`))

    let snapshot = await getDocs(q);

    if(!snapshot.empty){
        response = true;
    }else {
        response = false
    }

    return response;
}

module.exports = verifyFieldExist;