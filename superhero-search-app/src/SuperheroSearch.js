import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

const SuperheroSearch = () => {
    const [superheroes, setSuperheroes] = useState([]);
    const [fuse, setFuse] = useState(null); // Initialize Fuse instance
    const [nameSearch, setNameSearch] = useState('');
    const [raceSearch, setRaceSearch] = useState('');
    const [publisherSearch, setPublisherSearch] = useState('');
    const [idSearch, setIdSearch] = useState('');
    const [expandedHeroId, setExpandedHeroId] = useState(null);

    // Function to fetch superheroes
    const fetchSuperheroes = () => {
        fetch('JSONfiles/superhero_info.json')
            .then(response => response.json())
            .then(data => {
                setSuperheroes(data);
                const options = { keys: ['name'] }; // Search only in 'name' key
                setFuse(new Fuse(data, options));
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };
    const toggleHeroDetails = (heroId) => {
        setExpandedHeroId(expandedHeroId === heroId ? null : heroId);
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

    const removeWhiteSpace = (str) => str.replace(/\s+/g, '');

    const filterHeroes = () => {
        let filtered = superheroes;

        // Apply fuzzy search for name
        if (nameSearch && fuse) {
            const results = fuse.search(nameSearch);
            filtered = results.map(result => result.item);
        }

        // Apply other filters
        filtered = filtered.filter(hero => {
            const isRaceMatch = !raceSearch || removeWhiteSpace(hero.Race.toLowerCase()).includes(removeWhiteSpace(raceSearch));
            const isPublisherMatch = !publisherSearch || removeWhiteSpace(hero.Publisher.toLowerCase()).includes(removeWhiteSpace(publisherSearch));
            const isIdMatch = !idSearch || hero.id.toString() === idSearch.trim();

            return isRaceMatch && isPublisherMatch && isIdMatch;
        });

        return filtered;
    };

    const filteredHeroes = filterHeroes();

    const searchDuckDuckGo = (name) => {
        return `https://duckduckgo.com/?q=${encodeURIComponent(name)}`;
    };

    return (
        <div>
            <div>
                <button onClick={fetchSuperheroes}>Display Superheroes</button>
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
                <div key={hero.id} style={{ margin: '10px 0', cursor: 'pointer' }}>
                    <div onClick={() => toggleHeroDetails(hero.id)}>
                        <div><b>Name:</b> {hero.name} <b>Publisher:</b> {hero.Publisher}</div>
                        <div>Click to expand.</div>
                    </div>
                    {expandedHeroId === hero.id && (
                        <div>
                            <div>ID: {hero.id}</div>
                            <div>Gender: {hero.Gender}</div>
                            <div>Eye Color: {hero['Eye color']}</div>
                            <div>Race: {hero.Race}</div>
                            <div>Hair Color: {hero['Hair color']}</div>
                            <div>Height: {hero.Height !== -99 ? hero.Height + ' cm' : 'Unknown'}</div>
                            <div>Skin Color: {hero['Skin color']}</div>
                            <div>Alignment: {hero.Alignment}</div>
                            <div>Weight: {hero.Weight !== -99 ? hero.Weight + ' kg' : 'Unknown'}</div>
                                  {/* "Search on DDG" button */}
                        <a 
                            href={searchDuckDuckGo(hero.name)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-block',
                                marginTop: '10px',
                                padding: '10px 20px',
                                backgroundColor: 'gray', // Button color
                                color: 'white', // Text color
                                textAlign: 'center',
                                textDecoration: 'none',
                                borderRadius: '5px',
                            }}
                        >
                            Search on DDG
                        </a>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SuperheroSearch;
