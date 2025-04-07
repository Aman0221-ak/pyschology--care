const User = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const JWT_SECRET = process.env.JWT_SECRET || "ab0bee8c54537a3d3f7189e345064f43660889b45069310cb4f70dcef235fc1efb46455bac4fa047a22524db2e2918b1c7c3c35e3e9def85fb8ba2a5eedfdffe";


// ✅ Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { phone, dob, nationality, gender, language, timeZone, profilePicture } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { phone, dob, nationality, gender, language, timeZone, profilePicture },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// ✅ Fetch user profile with profile picture
const getProfile = async (req, res) => {
  try {
    console.log("Received request for profile. User ID:", req.user?._id);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      console.log("User not found in database.");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Sending user data:", user);
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// ✅ Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const base64Image = req.file.buffer.toString('base64'); // Convert image to Base64
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: `data:${req.file.mimetype};base64,${base64Image}` },
      { new: true }
    );

    res.json({ message: 'Profile picture updated', profilePicture: user.profilePicture });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image' });
  }
};


// ✅ Register User
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// ✅ Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// ✅ Forgot Password (Send Reset Link)
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token (expires in 15 minutes)
    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '15m' });

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    await sendEmail(user.email, "Password Reset Request", `Click here to reset your password: ${resetUrl}`);

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending reset link" });
  }
};

// ✅ Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Invalid token or user not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
};



module.exports = { 
  register, 
  login, 
  forgotPassword, 
  resetPassword,
  getProfile,
  updateProfile,
  uploadProfilePicture
};