const mongoose = require('mongoose');

const userCredentialsSchema = new mongoose.Schema({
  // store login details, connected to userProfile by unique userId
  loginId: String,
  password: String,
  userId: String
});

const userCredentials = mongoose.model('UserCredentials', userCredentialsSchema);

module.exports = userCredentials;