const express = require('express');
const { createOrder } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createOrder);

module.exports = router;
