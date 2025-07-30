const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contact');
const faqRoutes = require('./routes/faq');
const serviceRoutes = require('./routes/serviceRoutes');
const psychologistRoute = require("./routes/psychologistRoute");
const availabilityRoutes = require("./routes/availability");
const bookingRoutes = require("./routes/bookingRoutes.js");
const bookRoutes = require('./routes/bookRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const videoRoutes = require('./routes/videoRoutes');



console.log('JWT_SECRET:', process.env.JWT_SECRET || 'Not Found');

const app = express();
// Middleware
app.use(cors({
    origin: 'http://localhost:3000', 
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.get('/', (req, res) => {
  res.send('API is running...');
});


  // API routes
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/services', serviceRoutes);
app.use("/api/psychologists", psychologistRoute);
app.use("/api/availability", availabilityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use('/api/survey', surveyRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/videos', videoRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
   })
   .then(() => console.log('MongoDB connected'))
   .catch((err) => console.error('MongoDB connection error:', err));
 



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
