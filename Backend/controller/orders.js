const Order = require('../models/order');
const Product = require('../models/product');

exports.createOrder = async (req, res) => {
    const session = await Order.startSession();
    session.startTransaction();

    try {
        const { userDetails, items, totalAmount } = req.body;

        // Verify stock availability for all items
        for (const item of items) {
            const product = await Product.findById(item.product).session(session);
            if (!product) {
                throw new Error(`Product ${item.product} not found`);
            }
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }
        }

        // Create the order
        const order = new Order({
            userDetails,
            items,
            totalAmount,
            status: 'confirmed',
            orderDate: new Date()
        });

        await order.save({ session });

        // Update product stock and remove products with zero stock
        for (const item of items) {
            const product = await Product.findById(item.product).session(session);
            product.stock -= item.quantity;
            
            if (product.stock === 0) {
                await Product.findByIdAndDelete(product._id).session(session);
            } else {
                await product.save({ session });
            }
        }

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({
            success: false,
            message: error.message
        });
    } finally {
        session.endSession();
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('items.product', 'name price imageUrl');

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
