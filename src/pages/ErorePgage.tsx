import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>404</h1>
            <p style={styles.message}>Oops! The page you're looking for doesn't exist.</p>
            <button style={styles.button} onClick={handleGoBack}>
                Go Back to Home
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center' as const,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: '6rem',
        fontWeight: 'bold' as const,
        color: '#343a40',
    },
    message: {
        fontSize: '1.5rem',
        color: '#6c757d',
        marginBottom: '1.5rem',
    },
    button: {
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#C30A1D',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
    },
};

export default ErrorPage;