const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  problemsSolved: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  rank: String,
  submissions: [{
    problemId: String,
    title: String,
    difficulty: String,
    status: String,
    submissionDate: Date,
  }],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Progress = mongoose.model('Progress', progressSchema);
module.exports = Progress;
