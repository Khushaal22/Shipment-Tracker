const mongoose = require('mongoose');
const shipmentHistorySchema = new mongoose.Schema({
    shipmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment',
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'],
    },
    location: {
        type: String,
        trim: true,
        default: '',
    },
    note: {
        type: String,
        trim: true,
        default: '',
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true }
);

module.exports = mongoose.model('ShipmentHistory', shipmentHistorySchema);