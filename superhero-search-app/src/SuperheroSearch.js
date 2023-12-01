import React, { useState } from 'react';

const SuperheroSearch = () => {
    const [superheroes, setSuperheroes] = useState([]);
    const [nameSearch, setNameSearch] = useState('');
    const [raceSearch, setRaceSearch] = useState('');
    const [publisherSearch, setPublisherSearch] = useState('');
    const [idSearch, setIdSearch] = useState('');

    const fetchSuperheroes = () => {
        fetch('JSONfiles/superhero_info.json')
            .then(response => response.json())
            .then(data => {
                setSuperheroes(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const handleNameSearchChange = (event) => {
        setNameSearch(event.target.value.toLowerCase());
    };

    const handleRaceSearchChange = (event) => {
        setRaceSearch(event.target.value.toLowerCase());
    };

    const handlePublisherSearchChange = (event) => {
        setPublisherSearch(event.target.value.toLowerCase());
    };

    const handleIdSearchChange = (event) => {
        setIdSearch(event.target.value);
    };

    const filterHeroes = () => {
        return superheroes.filter(hero => {
            return (nameSearch && hero.name.toLowerCase().includes(nameSearch)) ||
                   (raceSearch && hero.Race.toLowerCase().includes(raceSearch)) ||
                   (publisherSearch && hero.Publisher.toLowerCase().includes(publisherSearch)) ||
                   (idSearch && hero.id.toString() === idSearch);
        });
    };

    const filteredHeroes = filterHeroes();

    return (
        <div>
            <div>
                <button onClick={fetchSuperheroes}>Display Superheros</button>
            </div>
            <div>
                <input 
                    type="text" 
                    placeholder="Search by Name" 
                    onChange={handleNameSearchChange} 
                />
                <input 
                    type="text" 
                    placeholder="Search by Race" 
                    onChange={handleRaceSearchChange} 
                />
                <input 
                    type="text" 
                    placeholder="Search by Publisher" 
                    onChange={handlePublisherSearchChange} 
                />
                <input 
                    type="text" 
                    placeholder="Search by ID" 
                    onChange={handleIdSearchChange} 
                />
            </div>

            {filteredHeroes.map(hero => (
                <div key={hero.id} style={{ margin: '10px 0' }}>
                              <div>Name: {hero.name}</div>
                              <div>ID: {hero.id}</div>
                    <div>Gender: {hero.Gender}</div>
                    <div>Eye Color: {hero['Eye color']}</div>
                    <div>Race: {hero.Race}</div>
                    <div>Hair Color: {hero['Hair color']}</div>
                    <div>Height: {hero.Height !== -99 ? hero.Height + ' cm' : 'Unknown'}</div>
                    <div>Publisher: {hero.Publisher}</div>
                    <div>Skin Color: {hero['Skin color']}</div>
                    <div>Alignment: {hero.Alignment}</div>
                    <div>Weight: {hero.Weight !== -99 ? hero.Weight + ' kg' : 'Unknown'}</div>
                </div>
            ))}
        </div>
    );
};

export default SuperheroSearch;
