const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")

const userCredentialsSchema = new mongoose.Schema({
  // store login details, connected to userProfile by unique userId
  loginId: String,
  password: String,
  userId: String
});


// Hash Password before storing into Database
userCredentialsSchema.pre('save',function(next){
  const user = this

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError)
      } else {
        bcrypt.hash(user.password, salt, function(hashError, hash) {
          if (hashError) {
            return next(hashError)
          }

          user.password = hash
          console.log('Hashed password',user.password)
          next()
        })
      }
    })
  } else {
    return next()
  }
})

//Compare password using bcrypt
userCredentialsSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const userCredentials = mongoose.model('UserCredentials', userCredentialsSchema);

module.exports = userCredentials;