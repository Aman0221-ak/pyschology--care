const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.get('/', videoController.getVideos);
router.post('/', videoController.addVideo);
router.delete('/:id', videoController.deleteVideo);

module.exports = router;
