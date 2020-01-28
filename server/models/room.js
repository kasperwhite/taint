const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true
  }],
  locked: {
    type: Boolean,
    required: true
  },
  time: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;