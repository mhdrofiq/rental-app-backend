const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema({
    vehicleName: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        required: true
    },
    fuelMaxCapacity: {
        type: String,
        required: true,
    },
    nextServiceDate: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Vehicle', vehicleSchema)