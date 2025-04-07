const Service = require('../models/Service');

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getServiceById = async (req, res) => {
    try {
      const service = await Service.findById(req.params.id);
  
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
  
      res.json(service);
    } catch (error) {
      console.error("Error fetching service by ID:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  