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
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";
        const category = req.query.category;
        const minPrice = parseFloat(req.query.minPrice);
        const maxPrice = parseFloat(req.query.maxPrice);
        const sort = req.query.sort;

        if (page < 1) page = 1;
        if (limit < 1) limit = 5;
        if (limit > 20) limit = 20;

        let sortOption = { createdAt: -1 };

        if (sort === "asc" || sort === "old") {
            sortOption = { createdAt: 1 };
        } else if (sort === "desc" || sort === "new") {
            sortOption = { createdAt: -1 };
        } else if (sort === "title") {
            sortOption = { title: 1 };
        } else if (sort === "priceAsc") {
            sortOption = { price: 1 };
        } else if (sort === "priceDesc") {
            sortOption = { price: -1 };
        }

        const filter = {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ]
        };

        if (category) {
            filter.category = category;
        }

        if (!isNaN(minPrice) || !isNaN(maxPrice)) {
            filter.price = {};

            if (!isNaN(minPrice)) {
                filter.price.$gte = minPrice;
            }

            if (!isNaN(maxPrice)) {
                filter.price.$lte = maxPrice;
            }
        }

        const total = await Product.countDocuments(filter);
        const pages = Math.ceil(total / limit) || 1;

        if (page > pages) {
            page = pages;
        }

        const skip = (page - 1) * limit;

        const products = await Product.find(
            filter,
            "_id title description price stock category image createdAt"
        )
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            status: "success",
            search,
            category: category || null,
            minPrice: !isNaN(minPrice) ? minPrice : null,
            maxPrice: !isNaN(maxPrice) ? maxPrice : null,
            page,
            limit,
            total,
            pages,
            data: products
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Server error"
        });
    }
};
const getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            })
        }
        return res.status(200).json({
            status: 'success',
            data: product
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
        })
    }
};
const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, price, image, stock, category } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                status: "error",
                message: "Product not found",
            });
        }

        if (price !== undefined && price <= 0) {
            return res.status(400).json({
                status: "error",
                message: "Price must be greater than 0",
            });
        }

        if (stock !== undefined && stock < 0) {
            return res.status(400).json({
                status: "error",
                message: "Stock cannot be negative",
            });
        }

        product.title = title ?? product.title;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.image = image ?? product.image;
        product.stock = stock ?? product.stock;
        product.category = category ?? product.category;

        await product.save();

        return res.status(200).json({
            status: "success",
            data: product,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Server error",
        });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                status: "error",
                message: "Product not found",
            })
        }
        await Product.findByIdAndDelete(id);
        return res.status(200).json({
            status: "success",
            message: "Product deleted successfully",
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Server error"
        })
    }
};
module.exports = { addProduct , getAllProducts , getProductById , updateProduct , deleteProduct};