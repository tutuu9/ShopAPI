const express = require('express');
const { createOrder, getMyOrders , getAllOrders , updateOrderStatus} = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getMyOrders);
router.get('/', authMiddleware, adminMiddleware, getAllOrders);
router.put('/:id', authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
