const Vehicle = require('../models/Vehicle')

// @route GET /vehicles
const getAllVehicles = async (req, res) => {
    const vehicles = await Vehicle.find().lean()
    if(!vehicles?.length){
        return res.status(400).json({message: 'No vehicles found'})
    }
    res.json(vehicles)
}

// @route GET /vehicleid
const getOneVehicle = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Vehicle ID required.' });

    const vehicle = await Vehicle.findOne({ _id: req.params.id }).exec();
    if (!vehicle) {
        return res.status(204).json({ "message": `No vehicle matches ID ${req.params.id}.` });
    }
    res.json(vehicle);
}

// @route POST /reviewer
const createNewVehicle = async (req, res) => {
    const { vehicleName, vehicleType, fuelMaxCapacity, nextServiceDate } = req.body

    if(!vehicleName || !vehicleType || !fuelMaxCapacity || !nextServiceDate) {
        return res.status(400).json({message: 'All fields are required'})
    }

    const vehicleObject = {vehicleName, vehicleType, fuelMaxCapacity, nextServiceDate}

    const vehicle = await Vehicle.create(vehicleObject)

    if(vehicle){
        res.status(201).json({message: `New vehicle ${vehicleName} created`})
    }else{
        res.status(400).json({message: 'Invalid vehicle data recieved'})
    }
}

// @route PATCH /vehicle
const updateVehicle = async (req, res) => {
    const {id, vehicleName, vehicleType, fuelMaxCapacity, nextServiceDate} = req.body

    //console.log(req.body)

    if(!vehicleName || !vehicleType || !fuelMaxCapacity || !nextServiceDate){
        return res.status(400).json({message: req.body})
    }

    const vehicle = await Vehicle.findById(id).exec()
    
    if(!vehicle){
        return res.status(400).json({message: 'Vehicle not found'})
    }

    vehicle.vehicleName = vehicleName
    vehicle.vehicleType = vehicleType
    vehicle.fuelMaxCapacity = fuelMaxCapacity
    vehicle.nextServiceDate = nextServiceDate

    const updatedVehicle = await Vehicle.save()

    res.json({message: `${updatedVehicle.vehicleName} data updated`})
}

// @route DELETE /vehicle
const deleteVehicle = async (req, res) => {
    const { id } = req.body

    if(!id){
        return res.status(400).json({message: 'Vehicle ID required' })
    }

    const vehicle = await Vehicle.findById(id).exec()

    if(!vehicle){
        return res.status(400).json({message: 'Vehicle not found'})
    }

    const result = await vehicle.deleteOne()

    const reply = `Vehicle ${result.vehicleName} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllVehicles,
    getOneVehicle,
    createNewVehicle,
    updateVehicle,
    deleteVehicle
}