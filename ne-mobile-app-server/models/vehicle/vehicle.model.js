const mongoose = require('mongoose');
const joi = require('joi');
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    model: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    plateNumber: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

//joi validation

const vehicleValidation = joi.object({
    model: joi.string().min(2).max(20).required(),
    manufacturer: joi.string().min(3).max(20).required(),
    plateNumber: joi.string().min(8).max(8).required(),
    photo: joi.string().required(),
    price: joi.number().required()
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = {
  Vehicle: Vehicle,
  vehicleValidation: vehicleValidation,
};