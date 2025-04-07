const SurveyResponse = require('../models/SurveyResponse');

exports.submitSurvey = async (req, res) => {
  try {
    const surveyData = new SurveyResponse(req.body);
    await surveyData.save();
    res.status(201).json({ message: "Survey submitted successfully." });
  } catch (error) {
    console.error("Error saving survey:", error);
    res.status(500).json({ message: "Failed to submit survey." });
  }
};
