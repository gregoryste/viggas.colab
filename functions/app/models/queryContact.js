async function list(firebase){
    // Firestore
    let db = firebase.firestore();
    let docRef = db.collection("contact")
    const response = [];

    await docRef.where('read', '!=', true).get().then(snapshot => { 
        snapshot.forEach(doc => { 
            response.push(doc.data()); 
        });
    })

    return response

}

async function update(firebase, id){
    // Firestore
    let db = firebase.firestore();

    const documentRef = db.collection('contact').doc(id);

    const updatedData = {
        read: true,
    };

    await documentRef.update(updatedData)

    let response = {
        "errors": [],
        "title": "Item adicionado aos lidos!",
        "type": "success"
    }

    return response
}

module.exports = {
    list: list,
    update: update,
}
