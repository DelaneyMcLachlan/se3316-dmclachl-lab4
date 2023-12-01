import React, { useState, useEffect } from 'react';

const SuperheroListManager = () => {
    const [lists, setLists] = useState([]);
    const [newListName, setNewListName] = useState('');
    const [superheroIds, setSuperheroIds] = useState('');

    // Function to fetch lists
    const fetchLists = () => {
        fetch('http://localhost:3001/get-superhero-lists')
            .then(response => response.json())
            .then(data => setLists(data))
            .catch(error => console.error('Error fetching lists:', error));
    };

    // Fetch lists initially and after every update
    useEffect(fetchLists, []);

    const handleCreateList = () => {
        fetch('http://localhost:3001/create-superhero-list-id', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listName: newListName, superheroIds: superheroIds.split(',').map(Number) }),
        })
        .then(response => response.json())
        .then(() => {
            setNewListName('');
            setSuperheroIds('');
            fetchLists(); // Re-fetch lists to update the UI
        })
        .catch(error => console.error('Error creating list:', error));
    };

    return (
        <div>
            <input 
                type="text" 
                value={newListName} 
                onChange={(e) => setNewListName(e.target.value)} 
                placeholder="List Name" 
            />
            <input 
                type="text" 
                value={superheroIds} 
                onChange={(e) => setSuperheroIds(e.target.value)} 
                placeholder="Superhero IDs (comma-separated)" 
            />
            <button onClick={handleCreateList}>Create List</button>

            <div>
                <h2>Superhero Lists</h2>
                {lists.map(list => (
                    <div key={list.name}>
                        <h3>{list.name}</h3>
                        <p>Superhero IDs: {list.superheroes.join(', ')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuperheroListManager;
