const express = require('express');
const multer = require('multer');
const { register, login, forgotPassword, resetPassword, uploadProfilePicture, getProfile, updateProfile, } = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const router = express.Router();

// Multer setup for handling image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// ✅ Fetch user profile
router.get('/profile', isAuthenticated, getProfile);


router.put('/update-profile', isAuthenticated, updateProfile);
    

// ✅ Upload profile picture
router.post('/upload-profile-picture', isAuthenticated, upload.single('file'), uploadProfilePicture);

// ✅ Register route
router.post('/register', register);

// ✅ Login route
router.post('/login', login);

// ✅ Forgot Password route
router.post('/forgot-password', forgotPassword);

// ✅ Reset Password route
router.post('/reset-password/:token', resetPassword);




module.exports = router;
