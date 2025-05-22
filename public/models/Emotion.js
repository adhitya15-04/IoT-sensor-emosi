const mongoose = require('mongoose');

const emotionSchema = new mongoose.Schema({
  emotion: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Emotion', emotionSchema);
