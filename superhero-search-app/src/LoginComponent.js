// LoginComponent.js
import React, { useState } from 'react';

const LoginComponent = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
    
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
    
            if (!response.ok) {
                throw new Error('Login failed');
            }
    
            const { accessToken } = await response.json();
            localStorage.setItem('jwtToken', accessToken); // Store the token in localStorage on the client
    
    
            
            if (response.ok) { // If the response status is 200 (OK), consider it a successful login
                onLoginSuccess(username); // This needs to be passed as a prop to LoginComponent
            }
    

        } catch (error) {
            console.error('Login error:', error);
            // Handle login error (e.g., show an error message)
        }
    };

    return (
        <form  onSubmit={handleLogin} >
            <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
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
