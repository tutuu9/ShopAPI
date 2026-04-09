const Product = require("../models/Product");

const addProduct = async (req, res) => {
    try {
        const { title, description, price, image, stock, category } = req.body;

        if (!title || !description || price === undefined || !category || stock === undefined) {
            return res.status(400).json({
                status: 'error',
                message: 'All fields are required'
            });
        }
        if (price <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Price must be greater than 0'
            });
        }

        if (stock < 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Stock cannot be negative'
            });
        }
        const existingProduct = await Product.findOne({ title });
        if (existingProduct) {
            return res.status(400).json({
                status: 'error',
                message: 'Product already exists'
            });
        }

        const product = await Product.create({
            title,
            description,
            price,
            image,
            stock,
            category
        });

        return res.status(201).json({
            status: 'success',
            data: product
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        return res.status(200).json({
            status: 'success',
            data: products
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

module.exports = { addProduct , getAllProducts };