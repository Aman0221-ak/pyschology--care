const Video = require('../models/Video');

// @desc Get all videos
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json({ videos });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch videos", error: err.message });
  }
};

// @desc Add new video
exports.addVideo = async (req, res) => {
  try {
    const { title, youtubeUrl, description } = req.body;
    const newVideo = new Video({ title, youtubeUrl, description });
    await newVideo.save();
    res.status(201).json({ message: "Video added successfully", video: newVideo });
  } catch (err) {
    res.status(500).json({ message: "Failed to add video", error: err.message });
  }
};

// @desc Delete a video
exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    await Video.findByIdAndDelete(id);
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete video", error: err.message });
  }
};
