// Import the Product model
const Product = require('../models/product');
const Category = require('../models/category');

// Create Product (Admin)
exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            discount_price: req.body.discount_price,
            category: req.body.category,
            imageUrl: req.body.imageUrl,
            stock: req.body.stock,
            features: req.body.features,
            specifications: req.body.specifications,
            status: req.body.status
        });

        const savedProduct = await newProduct.save();
        
        // Update the category's products array
        await Category.findByIdAndUpdate(
            req.body.category,
            { $addToSet: { products: savedProduct._id } },
            { new: true }
        );

        const populatedProduct = await Product.findById(savedProduct._id)
            .populate('category', 'name');

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: populatedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating product",
            error: error.message
        });
    }
};

// Get All Products (Public)
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category', 'name');

        res.status(200).json({
            success: true,
            products: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: error.message
        });
    }
};

// Get Product by ID (Public)
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching product",
            error: error.message
        });
    }
};

// Update Product (Admin)
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            discount_price: req.body.discount_price,
            category: req.body.category,
            stock: req.body.stock,
            imageUrl: req.body.imageUrl
        };

        console.log("Received update data:", updates); // Debug log

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        ).populate('category');

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        console.error("Update error:", error); // Debug log
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

// Delete Product (Admin)
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting product",
            error: error.message
        });
    }
};
