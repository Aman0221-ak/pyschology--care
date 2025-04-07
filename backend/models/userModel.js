const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profilePicture: { type: String }, // Stores image URL or Base64
    phone: { type: String },
    dob: { type: Date },
    nationality: { type: String },
    gender: { type: String },
    language: { type: String },
    timeZone: { type: String },
    lastLogin: { type: Date },
}, { timestamps: true });

// 🔹 Compare hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔹 Generate JWT token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
