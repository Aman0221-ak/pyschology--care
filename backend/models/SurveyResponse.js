const mongoose = require('mongoose');

const surveyResponseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  gender: String,
  strengths: String,
  weaknesses: String,
  goals: String,
  emotionalState: String,
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SurveyResponse', surveyResponseSchema);
