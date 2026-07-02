const Shipment = require('../models/Shipment');
const shipmentHistory = require('../models/shipmentHistory')

const createShipment = async (req, res) => {
    try {
        const {
            receiverName,
            receiverPhone,
            receiverEmail,
            pickupAddress,
            deliveryAddress,
            sourceCity,
            destinationCity,
            parcelWeight,
            parcelType
        } = req.body;

        if (!receiverName || !receiverPhone || !pickupAddress || !deliveryAddress || !sourceCity || !destinationCity || !parcelWeight || !parcelType) {
            return res.status(400).json({ message: 'All required fields must be filled' });
        }

        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        const trackingNumber = `SHP-${timestamp}-${random}`;

        const estimatedDelivery = new Date();
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

        const shipment = await Shipment.create({
            senderId: req.user.id,
            trackingNumber,
            receiverName,
            receiverPhone,
            receiverEmail,
            pickupAddress,
            deliveryAddress,
            sourceCity,
            destinationCity,
            parcelWeight,
            parcelType,
            estimatedDelivery
        });

        await shipmentHistory.create({
            shipmentId: shipment._id,
            status: 'pending',
            location: sourceCity,
            note: 'Shipment created and pickup is pending',
            updatedBy: req.user.id,
        });

        res.status(201).json({
            message: "Shipment created successfully",
            shipment
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getMyShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find({ senderId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ shipments });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getShipmentById = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        if (shipment.senderId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json({ shipment });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const cancelShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }
        if (shipment.senderId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (shipment.currentStatus !== 'pending') {
            return res.status(400).json({
                message: 'Shipment cannot be cancelled now'
            });
        }
        shipment.currentStatus = 'cancelled';
        shipment.cancelledAt = new Date();
        shipment.cancelReason = req.body.cancelReason || 'Cancelled by Sender';
        await shipment.save();

await shipmentHistory.create({
    shipmentId: shipment._id,
    status: 'cancelled',
    location: '',
    note: shipment.cancelReason,
    updatedBy: req.user.id,
});

        res.status(200).json({ message: 'Shipment cancelled successfully', shipment });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { createShipment, getMyShipments, getShipmentById, cancelShipment };