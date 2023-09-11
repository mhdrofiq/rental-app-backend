const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Vehicle'
    },
    administrator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    driverName: {
        type: String,
        required: true,
    },
    rentalDate: {
        type: Date, 
        default: Date.now 
    },
    returnDate: {
        type: Date, 
        default: Date.now 
    },
    approvedOn: {
        type: Date, 
        default: Date.now 
    },
    fuelConsumed: {
        type: String,
        default: '0'
    },
    orderStatus: {
        type: String,
        default: 'Approval Pending'
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('Order', orderSchema)