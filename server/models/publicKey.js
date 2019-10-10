const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

const Key = mongoose.model('Key', keySchema);

module.exports = Key;