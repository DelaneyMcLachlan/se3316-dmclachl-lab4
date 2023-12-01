import React, { useState } from 'react';

const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleNicknameChange = (event) => {
        setNickname(event.target.value);
    };

    const handleRegistration = async (event) => {
        event.preventDefault();

            // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the email is in valid format
    if (!emailRegex.test(email)) {
        setErrorMessage('Invalid email format');
        return; // Stop the function if the email is invalid
    }
    
        try {
            const user = {
                username,
                email,
                password,
                nickname,
                disableFlag: "enabled"  // Set disableFlag as "enabled" by default
            };
    
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Registration failed');
            }
    
            const data = await response.json();
            // Handle the response (e.g., success message, redirection)
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMessage(error.message || 'Failed to register. Please try again.');
        }
    
        // Consider resetting form fields here upon successful registration
    };

    return (
        <form onSubmit={handleRegistration}>
            <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={handleUsernameChange} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={handleEmailChange} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={handlePasswordChange} required />
            </div>
            <div>
                <label>Nickname:</label>
                <input type="text" value={nickname} onChange={handleNicknameChange} required />
            </div>
            <button type="submit">Register</button>
        </form>
    );
};

export default RegistrationForm;
