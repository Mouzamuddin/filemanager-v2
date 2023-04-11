const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  Id: {
    type: String,
    required: true,
  }, 
  uploadedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('File', fileSchema);