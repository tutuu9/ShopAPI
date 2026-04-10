const express = require('express');
const { addToCart , getCart , updateCartQuantity } = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, addToCart);
router.get('/', authMiddleware, getCart);
router.put('/:productId', authMiddleware, updateCartQuantity);

module.exports = router;