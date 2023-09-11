const express = require('express')
const router = express.Router()
const vehiclesController = require('../controllers/vehiclesController')

router.route('/')
    .get(vehiclesController.getAllVehicles)
    .post(vehiclesController.createNewVehicle)
    .patch(vehiclesController.updateVehicle)
    .delete(vehiclesController.deleteVehicle)

router.route('/:id').get(vehiclesController.getOneVehicle)

module.exports = router