const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    // to store account details, linked to userCredentials by unique userId
    firstName: String,
    lastName: String,
    abcPoints: Number,
    emailAddress: String,
    phoneNumber: String,
    userId: {
        type: String,
        ref: 'UserCredentials'
    }
});

const userProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = userProfile;