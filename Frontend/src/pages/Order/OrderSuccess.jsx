import React from 'react';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    Divider,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, orderDetails } = location.state || {};

    if (!orderId) {
        navigate('/');
        return null;
    }

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={3} className="success-paper">
                <Box className="success-icon">
                    <CheckCircleIcon fontSize="large" />
                </Box>
                
                <Typography variant="h4" component="h1" gutterBottom className="success-title">
                    Order Placed Successfully!
                </Typography>
                
                <Typography variant="body1" color="text.secondary" className="success-message">
                    Thank you for your order. We'll send you a confirmation email with your order details.
                </Typography>

                <Box className="order-info">
                    <Typography variant="h6" gutterBottom>
                        Order Details
                    </Typography>
                    <Typography variant="body1">
                        Order ID: #{orderId}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <LocalShippingIcon sx={{ mr: 1 }} />
                        <Typography variant="body1">
                            Estimated Delivery: 2-3 Business Days
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box className="action-buttons">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/products')}
                        className="continue-shopping"
                    >
                        Continue Shopping
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/orders')}
                        className="view-orders"
                    >
                        View Orders
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default OrderSuccess;
