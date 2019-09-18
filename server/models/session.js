const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  }
}, {
  timestamps: true
})

const Session = mongoose.model('User', sessionSchema);

module.exports = Session;