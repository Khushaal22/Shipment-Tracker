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
    recieverEmail: {
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
        enum: ['documents', 'electronics', 'clothing', 'fragile', 'other'], //should be selected as form
    },

    //Status
    currentStatus: {
        type: String,
        enum: ['Pending', 'picked_up', 'In_Transit', 'Out_For_Delivery', 'Delivered', 'Cancelled'],
        default: 'Pending',
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