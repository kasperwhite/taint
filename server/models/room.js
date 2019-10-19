const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hash: { // forsecure
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
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
  messages: [
    messageSchema
  ],
  publicKeys: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Key',
    required: false
  }]
}, {
  timestamps: true
})

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;