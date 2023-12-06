// LoginComponent.js
import React, { useState } from 'react';

const LoginComponent = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');



    const handleLogin = async (event) => {
        event.preventDefault();

        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };
    
        if (!isValidEmail(email)) {
            setErrorMessage('Invalid email format');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    

            if (response.status === 403) {
                // Handle user disabled case
                setErrorMessage('User is disabled, please contact site admin.');
            } else if (response.status === 401) {
                // Handle invalid email or password
                setErrorMessage('Invalid email or password');
            } else if (!response.ok) {
                // Handle other types of errors
                throw new Error('Invalid username or password.');
            }

           
    
            const { accessToken } = await response.json();
            localStorage.setItem('jwtToken', accessToken); // Store the token in localStorage on the client
    
    
            
            if (response.ok) { // If the response status is 200 (OK), consider it a successful login
                onLoginSuccess(email); // This needs to be passed as a prop to LoginComponent
            }
    

        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage(error.message);
        }
    };

    return (
        <form  onSubmit={handleLogin} >
            <div>
                <h2>Login Here!</h2>
                <label>Email:</label>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {errorMessage && <div className="error">{errorMessage}</div>}
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginComponent;
