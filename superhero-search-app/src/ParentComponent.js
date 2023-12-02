import React, { useState } from 'react';
import LoginComponent from './LoginComponent';
import SuperheroListManager from './SuperheroListManager';

const ParentComponent = () => {
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLoginSuccess = (username) => {
        setUsername(username);
        setIsLoggedIn(true);
    };

    return (
        <div>
            {!isLoggedIn ? (
                <LoginComponent onLoginSuccess={() => handleLoginSuccess(username)} />
            ) : (
                <SuperheroListManager loggedInUsername={username} />
            )}
        </div>
    );
};

export default ParentComponent;
