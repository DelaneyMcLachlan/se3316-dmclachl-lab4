import React, { useState } from 'react';
import './App.css';
import RegistrationForm from './RegistrationForm';
import SuperheroSearch from './SuperheroSearch'; 
import SuperheroPowerSearch from './SearchByPower';
import SuperheroListManager from './ListManager';
import LoginComponent from './LoginComponent';
import UpdatePassword from './UpdatePassword';
import PublicSuperheroLists from './PublicSuperheroLists';
import UserLists from './UserLists';
import CreateSuperheroList from './CreateNewList';

function App() {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [loggedInEmail, setLoggedInEmail] = useState(''); // State to store the logged-in user's email
    const [updateTrigger, setUpdateTrigger] = useState(false);

    const handleLoginSuccess = (email) => {
        setIsUserLoggedIn(true);
        setLoggedInEmail(email); // Set the logged-in user's email
    };

    const handleListUpdate = () => {
        setUpdateTrigger(prev => !prev); // Toggle to trigger an update
    };

    return (
        <div className="App">
            {!isUserLoggedIn ? (
                <>
                    <RegistrationForm />
                    <LoginComponent onLoginSuccess={handleLoginSuccess} />
                    <PublicSuperheroLists />
                    <SuperheroSearch />
                    <SuperheroPowerSearch />
                </>
           ) : (
            <>
                <SuperheroListManager />
                <UpdatePassword />
                <CreateSuperheroList email={loggedInEmail} onListUpdate={handleListUpdate} />
                <UserLists email={loggedInEmail} updateTrigger={updateTrigger} />
            </>
        )}
    </div>
);
}

export default App;


