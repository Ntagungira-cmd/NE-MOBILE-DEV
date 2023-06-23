//routes for vehicle
const express = require('express');
const {getAllVehicles, createVehicle, getVehicleById} = require('../../controllers/vehicle/vehicle.controller');
const upload = require("../../utils/cloudinary");

const router = express.Router();

router.post('/api/v1/vehicle/add', upload.single("photo") ,createVehicle);
router.get('/api/v1/vehicle/all', getAllVehicles);
router.get('/api/v1/vehicle/:id', getVehicleById);

module.exports.vehicleRouter = router;