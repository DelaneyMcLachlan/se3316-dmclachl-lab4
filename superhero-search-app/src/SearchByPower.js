import React, { useState, useEffect } from 'react';

const SuperheroPowerSearch = () => {
    const [powers, setPowers] = useState([]);
    const [superheroes, setSuperheroes] = useState([]);  // Add this line
    const [selectedPower, setSelectedPower] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [superheroPowers, setSuperheroPowers] = useState([]);

    // Fetch the powers data on component mount
    useEffect(() => {
        // Fetch powers data
        fetch('/JSONfiles/superhero_powers.json')
            .then(response => response.json())
            .then(data => {
                setPowers(Object.keys(data[0]).filter(key => key !== 'hero_names'));
                setSuperheroPowers(data); // Set the superhero powers data
            })
            .catch(error => console.error('Error fetching powers:', error));
    }, []);

    const handlePowerChange = (event) => {
        setSelectedPower(event.target.value);
    };
    const searchByPower = () => {
        const heroesWithPower = superheroPowers
            .filter(heroPower => heroPower[selectedPower] === 'True')
            .map(heroPower => heroPower.hero_names);

        setSearchResults(heroesWithPower);
    };

    return (
        <div>
            <select onChange={handlePowerChange} value={selectedPower}>
                <option value="">Select a Power</option>
                {powers.map(power => (
                    <option key={power} value={power}>{power}</option>
                ))}
            </select>
            <button onClick={searchByPower}>Search by Power</button>
            <div id="powersResults">
                {searchResults.map((name, index) => (
                    <div key={index}>{name}</div>
                ))}
            </div>
        </div>
    );
};

export default SuperheroPowerSearch;
