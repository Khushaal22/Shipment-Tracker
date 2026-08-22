const express = require('express');
const router = express.Router();
const {
    createShipment,
    getMyShipments,
    getShipmentById,
    cancelShipment,
    getDashboardStats,
    downloadReceipt,
} = require('../controllers/ShipmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('sender'), getDashboardStats);
router.get('/my', protect, authorize('sender'), getMyShipments);
router.post('/', protect, authorize('sender'), createShipment);
router.get('/:id/receipt', protect, authorize('sender'), downloadReceipt);
router.get('/:id', protect, authorize('sender'), getShipmentById);
router.patch('/:id/cancel', protect, authorize('sender'), cancelShipment);

module.exports = router;