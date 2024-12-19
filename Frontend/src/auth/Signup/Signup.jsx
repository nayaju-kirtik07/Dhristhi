import React, { useState } from 'react';
import { Button, TextField, Typography, Grid, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/config';
import CustomSnackbar from '../../Components/CustomSnackbar/CustomSnackbar';
import './Signup.css';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        c_password: '',
    });
    const [error, setError] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/signup', {
                first_name: formData.first_name,
                last_name: formData.last_name,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                c_password: formData.c_password
            });

            if (response.status === 201) {
                setSnackbar({
                    open: true,
                    message: 'Account created successfully! Redirecting to login...',
                    severity: 'success'
                });
                
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            console.error('Signup error:', error);
            setError(error.response?.data || 'An error occurred during signup');
            setSnackbar({
                open: true,
                message: error.response?.data || 'An error occurred during signup',
                severity: 'error'
            });
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-content">
                <Container maxWidth="sm">
                    <Typography variant="h3" className="signup-title">
                        Create Account
                    </Typography>
                    <Typography variant="body1" className="signup-subtitle">
                        Join us for a perfect coffee experience
                    </Typography>

                    {error && (
                        <Typography color="error" className="error-message" align="center">
                            {error}
                        </Typography>
                    )}

                    <form onSubmit={handleSubmit} className="signup-form">
                        <div className="name-fields-container">
                            <TextField
                                name="first_name"
                                label="First Name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                className="input-field name-field"
                            />
                            <TextField
                                name="last_name"
                                label="Last Name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                className="input-field name-field"
                            />
                        </div>
                        
                        <TextField
                            name="username"
                            label="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            className="input-field"
                        />
                        <Grid item xs={12}>
                            <TextField
                                name="email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                fullWidth
                                variant="outlined"
                                className="input-field"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="password"
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                fullWidth
                                variant="outlined"
                                className="input-field"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="c_password"
                                label="Confirm Password"
                                type="password"
                                value={formData.c_password}
                                onChange={handleChange}
                                required
                                fullWidth
                                variant="outlined"
                                className="input-field"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                className="signup-button"
                            >
                                Sign Up
                            </Button>
                        </Grid>
                    </form>

                    <Typography className="login-link">
                        Already have an account?
                        <Button
                            onClick={() => navigate("/login")}
                            className="login-button"
                        >
                            Login
                        </Button>
                    </Typography>
                </Container>
            </div>
            
            <CustomSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
            />
        </div>
    );
};

export default Signup;