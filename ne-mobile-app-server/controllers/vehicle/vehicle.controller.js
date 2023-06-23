//saving vehicle information, getting the vehicle information, and updating
const {
  vehicleValidation,
  Vehicle
} = require("../../models/vehicle/vehicle.model");

exports.createVehicle = async (req, res) => {
  try {
    const { model, manufacturer, plateNumber, price } = req.body;
    console.log(model, manufacturer, plateNumber, price, req.file.path);

    //Validate the request body
    // const { error } = vehicleValidation(req.body);

    // if (error) {
    //   return res.status(400).json(error);
    // }

    const vehicle = new Vehicle({
      model,
      manufacturer,
      plateNumber,
      photo: req.file.path, // Store the Cloudinary image URL
      price,
    });
    console.log(vehicle);

    // Save the vehicle to the database
    const savedVehicle = await vehicle.save();

    res.status(201).json(savedVehicle);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get a single vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a vehicle by ID
exports.updateVehicleById = async (req, res) => {
  try {
    const { model, manufacturer, plateNumber, price } = req.body;

    // Validate the request body
    const { error } = vehicleValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Find the vehicle by ID
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Update the vehicle properties
    vehicle.model = model;
    vehicle.manufacturer = manufacturer;
    vehicle.plateNumber = plateNumber;
    vehicle.price = price;

    // Check if a new photo was uploaded
    if (req.file) {
      // Upload the new vehicle photo to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      vehicle.photo = result.secure_url;
    }

    // Save the updated vehicle to the database
    const updatedVehicle = await vehicle.save();

    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a vehicle by ID
exports.deleteVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Delete the vehicle photo from Cloudinary
    await cloudinary.uploader.destroy(vehicle.photo.public_id);

    // Delete the vehicle from the database
    await vehicle.remove();

    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
