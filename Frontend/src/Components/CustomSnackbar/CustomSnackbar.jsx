import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import './CustomSnackbar.css';

const CustomSnackbar = ({ open, message, severity, onClose }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            className="custom-snackbar"
        >
            <Alert 
                onClose={onClose} 
                severity={severity}
                className={`custom-alert ${severity}`}
                elevation={6}
                variant="filled"
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default CustomSnackbar;
