const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({

}, {
  timestamps: true
})
userSchema.plugin(passportLocalMongoose, {
  limitAttempts: true,
  maxAttempts: 5 // forsecure
});

const User = mongoose.model('User', userSchema);

module.exports = User;