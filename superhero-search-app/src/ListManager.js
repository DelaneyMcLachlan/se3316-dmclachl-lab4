import React, { useState } from 'react';

const SuperheroListManager = () => {
    const [username, setUsername] = useState('');
    const [newListName, setNewListName] = useState('');
    const [description, setDescription] = useState('');
    const [superheroes, setSuperheroes] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleListNameChange = (event) => {
        setNewListName(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleSuperheroesChange = (event) => {
        setSuperheroes(event.target.value);
    };

    const createList = async () => {
        const superheroIds = superheroes.split(',')
            .map(id => parseInt(id.trim(), 10)) // Parse each ID to a number
            .filter(id => !isNaN(id)); // Filter out invalid numbers

        const listData = {
            username,
            listName: newListName,
            superheroIds,
            description
        };

        try {
            const response = await fetch('http://localhost:3001/create-superhero-list-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(listData),
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status})`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating list:', error);
            return null;
        }
    };

    const handleCreateList = async (event) => {
        event.preventDefault();
        const newList = await createList();
        if (newList) {
            alert('New list created successfully!');
            setUsername('');
            setNewListName('');
            setDescription('');
            setSuperheroes('');
        }
    };

    return (
        <div>
            <h2>Create New Superhero List</h2>
            <form onSubmit={handleCreateList}>
                <div>
                    <input 
                        type="text" 
                        placeholder="Enter Username"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div>
                    <input 
                        type="text" 
                        placeholder="Enter New List Name"
                        value={newListName}
                        onChange={handleListNameChange}
                    />
                </div>
                <div>
                    <input 
                        type="text" 
                        placeholder="Enter Superhero IDs (comma-separated)"
                        value={superheroes}
                        onChange={handleSuperheroesChange}
                    />
                </div>
                <div>
                    <input 
                        type="text" 
                        placeholder="Enter Description"
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                </div>
                <button type="submit">Create List</button>
            </form>
        </div>
    );
};

export default SuperheroListManager;

