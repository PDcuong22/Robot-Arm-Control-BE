const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Tên của bản ghi
  timestamp: { type: Date, default: Date.now() }, // Thời gian record
  actions: [
    {
      servoId: { type: Number, required: true },
      angle: { type: Number, required: true },
      timeDiff: { type: Number, required: true }, // Thời gian của hành động
    },
  ],
});

module.exports = mongoose.model('records', recordSchema);
