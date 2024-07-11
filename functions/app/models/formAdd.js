const { Timestamp } = require('firebase-admin/firestore');

async function addContact(firebase, data){
    // Firestore
    let db = firebase.firestore();

    data.inclusao = Timestamp.now()

    const addedDocRef = await db.collection("contact").add(data);

    const updatedData = {
        id: addedDocRef.id,
    };

    await addedDocRef.update(updatedData);

    let response = {
        "errors": [],
        "title": "Mensagem enviado com sucesso!",
        "type": "success"
    }

    return response;
}

module.exports = addContact