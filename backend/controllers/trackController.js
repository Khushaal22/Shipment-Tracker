const Shipment = require('../models/Shipment');
const ShipmentHistory = require('../models/shipmentHistory');

const trackShipment = async (req, res) => {
    try {
        const { trackingNumber } = req.params;
        const shipment = await Shipment.findOne({ trackingNumber });

        if (!shipment) {
            return res.status(404).json({ message: 'No shipment found associated with this tracking Number' });
        }

        const history = await ShipmentHistory.find({ shipmentId: shipment._id }).sort({ createdAt: 1 });
        res.status(200).json({
            shipment: {
                trackingNumber: shipment.trackingNumber,
                currentStatus: shipment.currentStatus,
                sourceCity: shipment.sourceCity,
                destinationCity: shipment.destinationCity,
                receiverName: shipment.receiverName,
                parcelType: shipment.parcelType,
                estimatedDelivery: shipment.estimatedDelivery,
                createdAt: shipment.createdAt,
            },
            history,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { trackShipment };