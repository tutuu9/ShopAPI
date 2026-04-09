const express = require('express');
const { addProduct, getAllProducts, getProductById, updateProduct} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', authMiddleware, adminMiddleware, addProduct);
router.get('/:id', getProductById);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);

module.exports = router;