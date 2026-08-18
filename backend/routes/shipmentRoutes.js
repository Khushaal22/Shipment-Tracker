const express = require('express');
const router = express.Router();
const {
    createShipment,
    getMyShipments,
    getShipmentById,
    cancelShipment,
    getDashboardStats,
} = require('../controllers/ShipmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('sender'), getDashboardStats);
router.post('/', protect, authorize('sender'), createShipment);
router.get('/my', protect, authorize('sender'), getMyShipments);
router.get('/:id', protect, authorize('sender'), getShipmentById);
router.patch('/:id/cancel', protect, authorize('sender'), cancelShipment);

module.exports = router;