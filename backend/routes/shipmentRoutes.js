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
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getDashboardStats);
router.get('/my', protect, getMyShipments);
router.post('/', protect, createShipment);
router.get('/:id/receipt', protect, downloadReceipt);
router.get('/:id', protect, getShipmentById);
router.patch('/:id/cancel', protect, cancelShipment);

module.exports = router;