import React, { useState } from 'react';
import './App.css';
import RegistrationForm from './RegistrationForm';
import SuperheroSearch from './SuperheroSearch'; 
import SuperheroPowerSearch from './SearchByPower';
import SuperheroListManager from './ListManager';
import LoginComponent from './LoginComponent';

function App() {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    const handleLoginSuccess = () => {
        setIsUserLoggedIn(true);
    };

    return (
        <div className="App">
            {!isUserLoggedIn ? (
                <>
                    <RegistrationForm />
                    <LoginComponent onLoginSuccess={handleLoginSuccess} />
                    <SuperheroSearch />
                    <SuperheroPowerSearch />
                </>
            ) : (
                <>
                    
                    <SuperheroListManager />
                </>
            )}
        </div>
    );
}

export default App;

