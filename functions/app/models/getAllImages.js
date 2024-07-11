const firebase = require('../models/firebase-admin.js');

async function getAllImages(repository){
    // Storage
    let storage = firebase.storage();
    const bucket = storage.bucket();
    const downloadLinks = [];

    const options = {
        prefix: repository,
    };
    
    const [files] = await bucket.getFiles(options);
    
    if (files.length === 0) {
        return [];
    }


    for (const file of files) {
        // Generate a signed URL for the downloaded file
        const expiration = Date.now() + 3600000; // URL expires in 1 hour (adjust as needed)
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: expiration,
        });
    
        downloadLinks.push({url});
    }
    
    return downloadLinks;
}

module.exports = getAllImages