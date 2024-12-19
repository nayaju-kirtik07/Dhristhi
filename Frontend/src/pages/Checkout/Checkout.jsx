import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    Stepper,
    Step,
    StepLabel,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';
import { api } from '../../api/config';

const steps = ['User Details', 'Payment', 'Confirmation'];

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateUserDetails = () => {
        const { fullName, email, phone, address, city, state, zipCode } = formData;
        return fullName && email && phone && address && city && state && zipCode;
    };

    const validatePayment = () => {
        const { cardNumber, expiryDate, cvv } = formData;
        return cardNumber && expiryDate && cvv;
    };

    const handleNext = () => {
        if (activeStep === 0 && !validateUserDetails()) {
            setError('Please fill in all user details');
            return;
        }
        if (activeStep === 1 && !validatePayment()) {
            setError('Please fill in all payment details');
            return;
        }
        if (activeStep === steps.length - 1) {
            handlePlaceOrder();
            return;
        }
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            // Create order with user details and cart items
            const orderData = {
                userDetails: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode
                },
                items: cartItems.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
            };

            // Place order and update stock
            const response = await api.post('/orders', orderData);

            if (response.data.success) {
                setSuccess(true);
                // Clear the cart after successful order
                clearCart();
                // Navigate to success page after 2 seconds
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (err) {
            console.error('Error placing order:', err);
            setError(err.response?.data?.message || 'Error placing order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderUserDetailsForm = () => (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="ZIP Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                />
            </Grid>
        </Grid>
    );

    const renderPaymentForm = () => (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Card Number"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Expiry Date"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="CVV"
                    name="cvv"
                    type="password"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    required
                />
            </Grid>
        </Grid>
    );

    const renderOrderSummary = () => (
        <Box>
            <Typography variant="h6" gutterBottom>
                Order Summary
            </Typography>
            {cartItems.map((item) => (
                <Box key={item.product._id} sx={{ mb: 2 }}>
                    <Typography>
                        {item.product.name} x {item.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Rs. {item.price * item.quantity}
                    </Typography>
                </Box>
            ))}
            <Typography variant="h6" sx={{ mt: 2 }}>
                Total: Rs. {cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)}
            </Typography>
        </Box>
    );

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Checkout
                </Typography>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box sx={{ mt: 4 }}>
                    {activeStep === 0 && renderUserDetailsForm()}
                    {activeStep === 1 && renderPaymentForm()}
                    {activeStep === 2 && renderOrderSummary()}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            onClick={handleBack}
                            disabled={activeStep === 0 || loading}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : activeStep === steps.length - 1 ? (
                                'Place Order'
                            ) : (
                                'Next'
                            )}
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <Snackbar
                open={!!error}
                autoHideDuration={3000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setError(null)} severity="error">
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar
                open={success}
                autoHideDuration={2000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="success">
                    Order placed successfully!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Checkout;
