import React, { useState } from 'react';

function CreateSuperheroList({ email, onListUpdate }) {
    const [listName, setListName] = useState('');
    const [description, setDescription] = useState('');
    const [superheroIds, setSuperheroIds] = useState(''); // Assuming this will be a comma-separated string
    const [visibility, setVisibility] = useState('public');
    const [errorMessage, setErrorMessage] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Validation: Check if listName or superheroIds are empty
        if (!listName.trim() || !superheroIds.trim()) {
            setErrorMessage('List name and superhero IDs cannot be empty.');
            return; // Stop the function if validation fails
        }
    
        // Convert superheroIds from string to array
        const idsArray = superheroIds.split(',').map(id => parseInt(id.trim(), 10));
    
        try {
            const response = await fetch('http://localhost:3001/create-superhero-list-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    listName,
                    superheroIds: idsArray,
                    description,
                    visibility
                }),
            });
    
            if(response.status === 400){
                throw new Error('Name already used. Please use a different name.');
            }
    
            if (!response.ok) {
                throw new Error('Failed to create the list');
            }

            if (response.ok) {
                // Clear the form and reset error message
                setListName('');
                setDescription('');
                setSuperheroIds('');
                setVisibility('public');
                setErrorMessage('');
    
                // Call the update trigger function passed from App.js
                onListUpdate();}
        
        } catch (error) {
            setErrorMessage(error.message);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Superhero List</h2>
            <div>
                <label>List Name:</label>
                <input type="text" value={listName} onChange={(e) => setListName(e.target.value)} required />
            </div>
            <div>
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            <div>
                <label>Superhero IDs (comma-separated):</label>
                <input type="text" value={superheroIds} onChange={(e) => setSuperheroIds(e.target.value)} required />
            </div>
            <div>
            <label>Visibility:</label>
                <label>
                    <input 
                        type="radio" 
                        value="private" 
                        checked={visibility === 'private'} 
                        onChange={() => setVisibility('private')} 
                    />
                    Private
                </label>
                <label>
                    <input 
                        type="radio" 
                        value="public" 
                        checked={visibility === 'public'} 
                        onChange={() => setVisibility('public')} 
                    />
                    Public
                </label>
            </div>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <button type="submit">Create List</button>
        </form>
    );
}

export default CreateSuperheroList;
