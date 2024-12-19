const Cart = require('../models/cart');
const Product = require('../models/product');

// Get cart for a user
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    let cart = await Cart.findOne({ user: userId }).populate(
      'items.product',
      'name imageUrl price stock'  // Added stock to populated fields
    );

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
        totalAmount: 0,
      });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message,
    });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity = 1 } = req.body;

    // Start a session for the transaction
    const session = await Cart.startSession();
    session.startTransaction();

    try {
      // Validate product exists and check stock (with session)
      const product = await Product.findById(productId).session(session);
      if (!product) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      // Check if there's enough stock
      if (product.stock < quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: product.stock === 0 
            ? 'Product is out of stock' 
            : `Only ${product.stock} items available`,
        });
      }

      let cart = await Cart.findOne({ user: userId }).session(session);

      // Create new cart if it doesn't exist
      if (!cart) {
        cart = new Cart({
          user: userId,
          items: [],
          totalAmount: 0,
        });
      }

      // Check if product already exists in the cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      let totalQuantity = quantity;
      if (existingItemIndex > -1) {
        totalQuantity += cart.items[existingItemIndex].quantity;
        // Check if total quantity exceeds available stock
        if (totalQuantity > product.stock) {
          await session.abortTransaction();
          return res.status(400).json({
            success: false,
            message: `Cannot add more items. Only ${product.stock} items available`,
          });
        }
        cart.items[existingItemIndex].quantity = totalQuantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
          price: product.price,
        });
      }

      // Update product stock
      product.stock -= quantity;
      await product.save({ session });

      // Save cart
      cart.calculateTotalAmount();
      await cart.save({ session });

      // Commit the transaction
      await session.commitTransaction();

      // Populate product details before sending the response
      await cart.populate('items.product', 'name imageUrl price stock');

      res.status(200).json({
        success: true,
        message: 'Item added to cart successfully',
        data: cart,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message,
    });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    // Start a session for the transaction
    const session = await Cart.startSession();
    session.startTransaction();

    try {
      const cart = await Cart.findOne({ user: userId }).session(session);
      if (!cart) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: 'Cart not found',
        });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex === -1) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: 'Item not found in cart',
        });
      }

      // Get the product and check stock
      const product = await Product.findById(productId).session(session);
      if (!product) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      const currentQuantity = cart.items[itemIndex].quantity;
      const quantityDiff = quantity - currentQuantity;

      // Check if there's enough stock for the quantity increase
      if (quantityDiff > 0 && product.stock < quantityDiff) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: product.stock === 0 
            ? 'Product is out of stock' 
            : `Only ${product.stock} additional items available`,
        });
      }

      // Update product stock
      product.stock -= quantityDiff;
      await product.save({ session });

      // Update cart quantity
      cart.items[itemIndex].quantity = quantity;
      cart.calculateTotalAmount();
      await cart.save({ session });

      // Commit the transaction
      await session.commitTransaction();

      await cart.populate('items.product', 'name imageUrl price stock');

      res.status(200).json({
        success: true,
        message: 'Cart updated successfully',
        data: cart,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message,
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    // Start a session for the transaction
    const session = await Cart.startSession();
    session.startTransaction();

    try {
      const cart = await Cart.findOne({ user: userId }).session(session);
      if (!cart) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: 'Cart not found',
        });
      }

      // Find the item to be removed
      const itemToRemove = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (!itemToRemove) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: 'Item not found in cart',
        });
      }

      // Return quantity to product stock
      const product = await Product.findById(productId).session(session);
      if (product) {
        product.stock += itemToRemove.quantity;
        await product.save({ session });
      }

      // Remove item from cart
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );

      cart.calculateTotalAmount();
      await cart.save({ session });

      // Commit the transaction
      await session.commitTransaction();

      await cart.populate('items.product', 'name imageUrl price stock');

      res.status(200).json({
        success: true,
        message: 'Item removed from cart successfully',
        data: cart,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message,
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Start a session for the transaction
    const session = await Cart.startSession();
    session.startTransaction();

    try {
      const cart = await Cart.findOne({ user: userId }).session(session);
      if (!cart) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: 'Cart not found',
        });
      }

      // Return quantities to product stock
      for (const item of cart.items) {
        const product = await Product.findById(item.product).session(session);
        if (product) {
          product.stock += item.quantity;
          await product.save({ session });
        }
      }

      // Clear cart items
      cart.items = [];
      cart.totalAmount = 0;
      await cart.save({ session });

      // Commit the transaction
      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: 'Cart cleared successfully',
        data: cart,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message,
    });
  }
};
