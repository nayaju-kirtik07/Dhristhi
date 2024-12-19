import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../../Context/CartContext';
import { api } from '../../api/config';
import './Cart.css';

const Cart = () => {
    const { 
        isCartOpen, 
        toggleCart, 
        cartItems, 
        removeFromCart, 
        updateQuantity,
        loading
    } = useCart();

    const navigate = useNavigate();

    const [error, setError] = useState(null);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleUpdateQuantity = async (item, newQuantity) => {
        try {
            // Get current product stock
            const response = await api.get(`/get-single-product/${item.product._id}`);
            const product = response.data.product;

            if (!product) {
                setError('Product not found');
                return;
            }

            if (product.stock < newQuantity) {
                setError(product.stock === 0 
                    ? 'Product is out of stock' 
                    : `Only ${product.stock} items available`);
                return;
            }

            // If stock is sufficient, update quantity
            updateQuantity(item.product._id, newQuantity);
        } catch (err) {
            console.error('Error checking product stock:', err);
            setError('Failed to update quantity. Please try again.');
        }
    };

    const handleRemoveItem = (productId) => {
        removeFromCart(productId);
    };

    const handleCheckout = () => {
        toggleCart(); // Close the cart drawer
        navigate('/order'); // Navigate to checkout page
    };

    return (
        <>
            <Drawer
                anchor="right"
                open={isCartOpen}
                onClose={toggleCart}
                className="cart-drawer"
            >
                <Box sx={{ width: 350, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Shopping Cart</Typography>
                        <IconButton onClick={toggleCart}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : cartItems.length === 0 ? (
                        <Typography variant="body1" sx={{ textAlign: 'center', mt: 3 }}>
                            Your cart is empty
                        </Typography>
                    ) : (
                        <>
                            <List>
                                {cartItems.map((item) => (
                                    <ListItem key={item.product._id} divider>
                                        <Box sx={{ display: 'flex', width: '100%' }}>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <ListItemText
                                                    primary={item.product.name}
                                                    secondary={`Rs. ${item.price}`}
                                                />
                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <RemoveIcon />
                                                    </IconButton>
                                                    <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => handleRemoveItem(item.product._id)}
                                                >
                                                    <DeleteOutlineIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                            <Box sx={{ mt: 2, p: 2, borderTop: 1, borderColor: 'divider' }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Total: Rs. {calculateTotal().toFixed(2)}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleCheckout}
                                    disabled={cartItems.length === 0}
                                >
                                    Checkout
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Drawer>

            {/* Error Snackbar */}
            <Snackbar
                open={!!error}
                autoHideDuration={3000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Cart;