import React, { useState } from 'react';

function EditUserList({ listDetails, onSave }) {
    const [listName, setListName] = useState(listDetails.listName);
    const [description, setDescription] = useState(listDetails.description);
    const [superheroIds, setSuperheroIds] = useState(listDetails.superheroes.map(hero => hero.id).join(', '));
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/update-superhero-list', {
                method: 'POST', // or 'PUT' if your server is set up for it
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: listDetails.email, // Assuming email is part of listDetails
                    listId: listDetails.id,  // Assuming list has an id
                    newListName: listName,
                    newSuperheroIds: superheroIds.split(',').map(id => parseInt(id.trim(), 10)),
                    newDescription: description
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update the list');
            }

            onSave(); // Callback to refresh lists in the parent component
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Edit List</h3>
            {/* Form fields for editing list name, description, superhero IDs */}
            {/* ... */}
            {errorMessage && <p className="error">{errorMessage}</p>}
            <button type="submit">Save Changes</button>
        </form>
    );
}

export default EditUserList;
