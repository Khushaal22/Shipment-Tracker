const mongoose = require('mongoose')
const shipmentSchema = new mongoose.Schema({

    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    trackingNumber: {
        type: String,
        required: true,
        unique: true
    },

    //reciever Details
    receiverName: {
        type: String,
        required: true,
        trim: true
    },
    receiverPhone: {
        type: String,
        required: true,
        trim: true,
    },
    receiverEmail: {
        type: String,
        trim: true,
        lowercase: true
    },

    //Addresses
    pickupAddress: {
        type: String,
        required: true,
        trim: true
    },
    deliveryAddress: {
        type: String,
        required: true,
        trim: true,
    },
    sourceCity: {
        type: String,
        required: true,
        trim: true
    },
    destinationCity: {
        type: String,
        required: true,
        trim: true
    },

    //Parcel Info
    parcelWeight: {
        type: Number,
        required: true,
    },
    parcelType: {
        type: String,
        required: true,
        enum: ['documents', 'electronics', 'clothing', 'fragile', 'other'],
    },

    //Status
    currentStatus: {
        type: String,
        enum: ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'pending',
    },
    estimatedDelivery: {
        type: Date,
    },

    //Cancellation
    cancelledAt: {
        type: Date,
    },
    cancelReason: {
        type: String,
        trim: true,
    },
},
    { timestamps: true }
);
module.exports = mongoose.model('Shipment', shipmentSchema);