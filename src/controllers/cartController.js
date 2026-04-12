const Cart = require('../models/Cart');
const Product = require('../models/Product');

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId) {
            return res.status(400).json({
                status: 'error',
                message: 'Product id is required'
            });
        }

        if (quantity === undefined) {
            return res.status(400).json({
                status: 'error',
                message: 'Quantity is required'
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Quantity must be greater than 0'
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                items: [
                    {
                        product: productId,
                        quantity
                    }
                ]
            });

            return res.status(201).json({
                status: 'success',
                message: 'Product added to cart',
                data: cart
            });
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity
            });
        }

        await cart.save();

        return res.status(200).json({
            status: 'success',
            message: 'Product added to cart',
            data: cart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
const getCart = async (req,res) =>{
    try{
        const cart = await Cart.findOne({user: req.user.id})
        if(!cart){
            return res.status(200).json({
                status: 'success',
                message: 'Cart is empty',
                data: null
            });
        }

        await cart.populate('items.product');

        return res.status(200).json({
            status: 'success',
            message: 'Cart',
            data: cart
        })
    } catch (error){
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined) {
            return res.status(400).json({
                status: 'error',
                message: 'Quantity is required'
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Quantity must be greater than 0'
            });
        }

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Cart not found'
            });
        }

        const item = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found in cart'
            });
        }

        item.quantity = quantity;

        await cart.save();

        return res.status(200).json({
            status: 'success',
            message: 'Cart updated successfully',
            data: cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({
                status: 'error',
                message: 'Product id is required'
            });
        }

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Cart not found'
            });
        }

        const initialLength = cart.items.length;

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        if (cart.items.length === initialLength) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found in cart'
            });
        }

        await cart.save();

        return res.status(200).json({
            status: 'success',
            message: 'Product removed from cart',
            data: cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
const clearCart = async (req, res) => {
    try{
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Cart not found'
            });
        };
        cart.items = [];
        await cart.save();
        return res.status(200).json({
            status: 'success',
            message: 'Cart cleared successfully',
            data: cart
        });

    } catch (error){
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
module.exports = { addToCart , getCart , updateCartQuantity , removeFromCart , clearCart};