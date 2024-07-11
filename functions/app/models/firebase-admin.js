const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

// import service account file (helps to know the firebase project details)
const serviceAccount = require("../../config/key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.BUCKET,
});

module.exports = admin