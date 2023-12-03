import React, { useState } from 'react';

const UpdatePassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/updatepassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, newPassword }),
            });

            if (!response.ok) {
                throw new Error('Failed to update password');
            }

            setMessage('Password updated successfully');
        } catch (error) {
            console.error('Update password error:', error);
            setMessage(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>New Password:</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <button type="submit">Update Password</button>
            {message && <div>{message}</div>}
        </form>
    );
};

export default UpdatePassword;
