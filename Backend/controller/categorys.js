// Import the required models
const Category = require('../models/category');
const Product = require('../models/product');

// Get All Categories API with populated products
exports.getAllCategories = async (req, res) => {
    try {
       const category = await Category.find();

       if(!category) {
        res.status(404).send("category not found")
       }

       res.status(201).send(category)
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching categories.',
            error: error.message,
        });
    }
};

// Get Category with Products API
exports.getCategoryWithProducts = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find products for this category
        const products = await Product.find({ category: id });
        
        // Get category and attach products
        const category = await Category.findById(id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found.',
            });
        }

        const categoryWithProducts = category.toObject();
        categoryWithProducts.products = products;

        res.status(200).json({
            success: true,
            data: categoryWithProducts,
        });
    } catch (error) {
        console.error('Error fetching category with products:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the category and its products.',
            error: error.message,
        });
    }
};

// Edit Category API
exports.editCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const category = await Category.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found.',
            });
        }

        // Get products for this category
        const products = await Product.find({ category: id });
        const categoryWithProducts = category.toObject();
        categoryWithProducts.products = products;

        res.status(200).json({
            success: true,
            message: 'Category updated successfully.',
            data: categoryWithProducts,
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the category.',
            error: error.message,
        });
    }
};

// Remove Category API
exports.removeCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        // First find the category to get its products
        const category = await Category.findById(id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found.',
            });
        }

        // Remove category reference from all associated products
        await Product.updateMany(
            { _id: { $in: category.products } },
            { $unset: { category: 1 } }
        );

        // Delete the category
        const deletedCategory = await Category.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Category removed successfully.',
            data: deletedCategory,
        });
    } catch (error) {
        console.error('Error removing category:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while removing the category.',
            error: error.message,
        });
    }
};

// Create Category API
exports.createCategory = async (req, res) => {
    try {
        const existingCategory = await Category.findOne({ name: req.body.name });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category with this name already exists.',
            });
        }

        const category = new Category({
            name: req.body.name,
            description: req.body.description,
        });

        const savedCategory = await category.save();

        res.status(201).json({
            success: true,
            message: 'Category created successfully.',
            data: savedCategory,
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the category.',
            error: error.message,
        });
    }
};

// Add this method to update category when product is added
exports.updateCategoryProducts = async (categoryId, productId) => {
    try {
        await Category.findByIdAndUpdate(
            categoryId,
            { $addToSet: { products: productId } }, // $addToSet prevents duplicates
            { new: true }
        );
    } catch (error) {
        console.error('Error updating category products:', error);
        throw error;
    }
};
