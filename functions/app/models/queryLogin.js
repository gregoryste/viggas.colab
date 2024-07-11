const dotenv = require('dotenv');
dotenv.config();

async function queryLogin(res, req, firebase, data){

  return firebase.auth().getUser(data.uid).then(userRecord => {
    return userRecord;
  }).catch(error => {
    return undefined;
  });
}

module.exports = queryLogin;