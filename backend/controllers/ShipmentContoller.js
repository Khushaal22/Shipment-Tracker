const Shipment = require('../models/Shipment')
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

        if (!receiverName || !receiverPhone || !receiverEmail || !pickupAddress || !deliveryAddress || !sourceCity || !destinationCity || !parcelWeight || !parcelType) {
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
        const shipments = (await Shipment.find({ senderId: req.user.id })).Sort({ createdAt: -1 });
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
            return res.status(403).json({ messaage: 'Access denied' });
        }

        res.status(200).json({ shipment });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.messaage });
    }
};

const cancelShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        // only shipper can cancel the order... the logged in sender only sees his tracking therefore he can cancel it
        if (shipment.senderId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (shipment.currentStatus !== 'Pending') {
            return res.status(400).json({
                messaage: 'Shipment cannot be cancel now'
            });
        }
        shipment.currentStatus = 'Cancelled';
        shipment.cancelledAt = new Date();
        shipment.cancelReason = req.body.cancelReason || 'Cancelled by Sender';
        await shipment.save();

        res.status(200).json({ message: 'Shipment cancelled successsfully', shipment });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.messaage });
    }
};

module.exports = { createShipment, getMyShipments, getShipmentById, cancelShipment };