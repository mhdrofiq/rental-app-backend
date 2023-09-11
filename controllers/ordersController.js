const User = require('../models/User')
const Order = require('../models/Order')
const Vehicle = require('../models/Vehicle')

// @route GET /orders
const getAllOrders = async (req, res) => {
    const orders = await Order.find().lean()

    if(!orders?.length){
        return res.status(400).json({message: 'No orders found'})
    }

    //add username to each letter before sending the response
    const ordersWithUser = await Promise.all(orders.map(async (order) => {
        const administrator = await User.findById(order.administrator).lean().exec()
        const reviewer = await User.findById(order.reviewer).lean().exec()
        const vehicle = await Vehicle.findById(order.vehicle).lean().exec()
        return { 
            ...order, 
            adminName: administrator.fullName,
            reviewerName: reviewer.fullName,
            vehicleName: vehicle.vehicleName
        }
    }))

    res.json(ordersWithUser)
}

// @route GET /orderid
const getOneOrder = async (req, res) => {
    const { id } = req.params

    const order = await Order.findOne({ _id: req.params.id }).exec();
    if (!order) {
        return res.status(204).json({ "message": `No order matches ID ${req.params.id}.` });
    }

    res.json(order)
}

// @route POST /order
const createNewOrder = async (req, res) => {
    const { vehicle, administrator, reviewer, driverName, rentalDate, returnDate, approvedOn, fuelConsumed, orderStatus} = req.body

    if(!vehicle || !administrator || !reviewer || !driverName) {
        return res.status(400).json({message: 'All fields are required <' + vehicle + '> <' + administrator + '> <' + reviewer + '> <' + driverName + '>'})
    }   

    const orderData = {
        vehicle: vehicle, 
        administrator: administrator, 
        reviewer: reviewer,
        driverName: driverName, 
        rentalDate: rentalDate, 
        returnDate: returnDate, 
        approvedOn: approvedOn, 
        fuelConsumed: fuelConsumed, 
        orderStatus: orderStatus,
    }

    const order = await Order.create(orderData)

    //if created
    if(order){
        res.status(201).json({message: `New order by ${administrator} for vehicle ${vehicle} created`})
    }else{
        res.status(400).json({message: 'Invalid order data recieved'})
    }
}

// @route PATCH /order
const updateOrder = async (req, res) => {
    const { id, vehicle, administrator, reviewer, driverName, rentalDate, returnDate, approvedOn, fuelConsumed, orderStatus } = req.body

    if(!vehicle || !administrator || !reviewer || !driverName){
        return res.status(400).json({message: 'All fields are required'})
    }

    const order = await Order.findById(id).exec()

    if(!order){
        return res.status(400).json({message: 'Order not found'})
    }

    order.vehicle = vehicle
    order.administrator = administrator
    order.reviewer = reviewer
    order.driverName = driverName
    order.rentalDate = rentalDate
    order.returnDate = returnDate
    order.approvedOn = approvedOn
    order.fuelConsumed = fuelConsumed
    order.orderStatus = orderStatus

    const updatedOrder = await order.save()

    res.json({message: `${updatedOrder._id} data updated`})
}

// @route DELETE /order
const deleteOrder = async (req, res) => {
    const { id } = req.body

    if(!id){
        return res.status(400).json({message: 'Order ID required' })
    }

    const order = await Order.findById(id).exec()
    if(!order){
        return res.status(400).json({message: 'Order not found, delete failed'})
    }

    const result = await order.deleteOne()

    const reply = `Order by ${result.administrator} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllOrders,
    getOneOrder,
    createNewOrder,
    updateOrder,
    deleteOrder
}