const Cart = require('../models/Cart');
const Order = require('../models/Order');

const createOrder = async (req, res) => {
    try {
        const { address } = req.body;

        if (!address) {
            return res.status(400).json({
                status: 'error',
                message: 'Address is required',
            });
        }

        const requiredAddressFields = ['country', 'city', 'street', 'house', 'postalCode'];

        for (const field of requiredAddressFields) {
            if (!address[field]) {
                return res.status(400).json({
                    status: 'error',
                    message: `${field} is required`,
                });
            }
        }

        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Cart not found',
            });
        }

        if (!cart.items.length) {
            return res.status(400).json({
                status: 'error',
                message: 'Cart is empty',
            });
        }

        const orderItems = cart.items.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
        }));

        const totalAmount = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const order = await Order.create({
            user: req.user.id,
            address: {
                country: address.country,
                city: address.city,
                street: address.street,
                house: address.house,
                apartment: address.apartment || '',
                postalCode: address.postalCode,
            },
            items: orderItems,
            totalAmount,
        });

        cart.items = [];
        await cart.save();

        await order.populate('items.product user');

        return res.status(201).json({
            status: 'success',
            message: 'Order created successfully',
            data: order,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error',
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: 'success',
            data: orders,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error',
        });
    }
};

module.exports = { createOrder, getMyOrders };
