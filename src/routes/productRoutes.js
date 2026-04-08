const express = require('express');
const { addProduct } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, addProduct);

module.exports = router;