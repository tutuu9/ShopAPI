const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        address: {
            country: {
                type: String,
                required: true,
                trim: true,
            },
            city: {
                type: String,
                required: true,
                trim: true,
            },
            street: {
                type: String,
                required: true,
                trim: true,
            },
            house: {
                type: String,
                required: true,
                trim: true,
            },
            apartment: {
                type: String,
                trim: true,
                default: '',
            },
            postalCode: {
                type: String,
                required: true,
                trim: true,
            },
        },
        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: function(items) {
                    return items.length > 0;
                },
                message: 'Order must contain at least one item',
            },
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
