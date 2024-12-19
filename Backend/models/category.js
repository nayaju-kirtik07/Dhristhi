// Import mongoose
const mongoose = require('mongoose');

// Define the Category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'  // Reference to the Product model
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the `updatedAt` field before saving
categorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware to populate products when querying
categorySchema.pre(/^find/, function(next) {
  this.populate('products');
  next();
});

// Create the Category model
const Category = mongoose.model('Category', categorySchema);

// Export the Category model
module.exports = Category;
