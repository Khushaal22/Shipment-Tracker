const express = require('express');
const router = express.Router();
const { trackShipment } = require('../controllers/trackController');

router.get('/:trackingNumber', trackShipment);

module.exports = router;
