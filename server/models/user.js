const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  avatarId: {
    type: Number,
    required: true
  },
  visible: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
})
userSchema.plugin(passportLocalMongoose, {
  limitAttempts: true,
  maxAttempts: 5 // forsecure
});

const User = mongoose.model('User', userSchema);

module.exports = User;