import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Box,
    Divider,
    CircularProgress,
    Alert,
    Snackbar,
    Card,
    CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';
import { api } from '../../api/config';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import './Order.css';

const Order = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const orderData = {
                userDetails: formData,
                items: cartItems.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: calculateTotal(),
                status: 'pending'
            };

            const response = await api.post('/add-order', orderData);

            if (response.data.success) {
                clearCart();
                navigate('/order-success', { 
                    state: { 
                        orderId: response.data.data._id,
                        orderDetails: response.data.data 
                    }
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                    Your cart is empty
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/products')}
                    sx={{ mt: 2 }}
                >
                    Continue Shopping
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
            <Typography variant="h4" component="h1" gutterBottom className="order-title">
                <ShoppingCartIcon sx={{ mr: 1 }} />
                Checkout
            </Typography>

            <Grid container spacing={4}>
                {/* Order Form */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }} className="order-container">
                        <Typography variant="h6" gutterBottom className="form-section-title">
                            <LocalShippingIcon sx={{ mr: 1 }} />
                            Shipping Details
                        </Typography>
                        <form className='order-form' onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Full Name"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Address"
                                        name="address"
                                        multiline
                                        rows={2}
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="City"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="State"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="ZIP Code"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h6" gutterBottom className="form-section-title">
                                    <PaymentIcon sx={{ mr: 1 }} />
                                    Payment Method
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Cash on Delivery
                                </Typography>
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                disabled={loading}
                                sx={{ mt: 4 }}
                                className="submit-button"
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Place Order'
                                )}
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                {/* Order Summary */}
                <Grid item xs={12} md={4}>
                    <Card elevation={3} className="order-summary">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Order Summary
                            </Typography>
                            <Box sx={{ mb: 3 }}>
                                {cartItems.map((item) => (
                                    <Box key={item.product._id} sx={{ mb: 2 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={3}>
                                                <img
                                                    src={item.product.imageUrl}
                                                    alt={item.product.name}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={9}>
                                                <Typography variant="subtitle1">
                                                    {item.product.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.quantity} x Rs. {item.price}
                                                </Typography>
                                                <Typography variant="subtitle2">
                                                    Rs. {(item.quantity * item.price).toFixed(2)}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ mt: 2 }}>
                                <Grid container justifyContent="space-between">
                                    <Typography variant="h6">Total:</Typography>
                                    <Typography variant="h6">
                                        Rs. {calculateTotal().toFixed(2)}
                                    </Typography>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setError(null)} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Order;