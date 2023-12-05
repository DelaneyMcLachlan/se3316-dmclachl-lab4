import React, { useState, useEffect } from 'react';


function UserLists({ email, updateTrigger }) {
    const [userData, setUserData] = useState(null);
    const [expandedList, setExpandedList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [editingList, setEditingList] = useState(null);
    const [editedListName, setEditedListName] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedSuperheroIds, setEditedSuperheroIds] = useState([]); 
    const [editedVisibility, setEditedVisibility] = useState('public');

    const startEditing = (list) => {
        setEditingList(list.listName);
        setEditedListName(list.listName);
        setEditedDescription(list.description);
        setEditedSuperheroIds(list.superheroes.map(Number));
        setEditedVisibility(list.visibility);
    };

    const submitListEdit = () => {
        updateList(editingList, editedListName, editedSuperheroIds, editedDescription , editedVisibility);
       setEditingList(null);
    };

    const updateList = async (listName, newListName, newSuperheroIds, newDescription, newVisibility) => {
        try {
            const response = await fetch('http://localhost:3001/update-superhero-list', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                
                },
                body: JSON.stringify({
                    email: email, 
                    listName, 
                    newListName, 
                    newSuperheroIds, 
                    newDescription,
                    newVisibility 
                }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            if (response.ok) {
                fetchUserLists(); // Re-fetch the lists to update the UI
            }
        

            // Assuming handleListUpdate is a prop function that toggles `updateTrigger`
            //handleListUpdate(); // This will re-trigger the useEffect in UserLists
        } catch (error) {
            console.error('Error updating list:', error);
        }
    }; 
    
    const deleteList = async (listName) => {
        // Show a confirmation dialog
        const isConfirmed = window.confirm(`Are you sure you want to permanently delete the list '${listName}'?`);
        
        // If the user clicks "OK", proceed with the deletion
        if (isConfirmed) {
            try {
                const response = await fetch('http://localhost:3001/delete-superhero-list', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, listName }),
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                // Re-fetch the lists or use local state update to reflect the change
                fetchUserLists(); // Assuming you have a function to fetch lists
            } catch (error) {
                console.error('Error deleting list:', error);
            }
        }
    };
    

    const fetchUserLists = () => {
        fetch(`/users/${email}/lists`)
            .then(response => response.json())
            .then(data => {
                setUserData(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUserLists();
    }, [email, updateTrigger]);

    const toggleList = (listName) => {
        setExpandedList(expandedList === listName ? null : listName);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>{userData?.nickname}'s Lists</h2>
            <div>
                {userData?.lists.map(list => (
                    <div key={list.listName}>
                        {editingList === list.listName ? (
                            <div>
                                <input
                                    type="text"
                                    value={editedListName}
                                    onChange={(e) => setEditedListName(e.target.value)}
                                />
                                <textarea
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                />
                                <input
                                    type="text"
                                    onChange={(e) => setEditedSuperheroIds(
                                        e.target.value.split(',')
                                        .map(id => id.trim())
                                        .filter(id => !isNaN(id) && id !== '')
                                        .map(Number) // Convert to number
                                    )} 
                                />
                                <select value={editedVisibility} onChange={(e) => setEditedVisibility(e.target.value)}>
    <option value="public">Public</option>
    <option value="private">Private</option>
</select>
                                <button onClick={() => submitListEdit(list.listName)}>Save</button>
                                <button onClick={() => setEditingList(null)}>Cancel</button>
                                <button onClick={() => deleteList(list.listName)}>Delete</button>
                            </div>
                        ) : (
                            <div onClick={() => toggleList(list.listName)}>
                                   <h3>{list.listName}</h3>
                        <p>Description: {list.description}</p>
                        <p>Last Edited: {new Date(list.lastEdited).toLocaleString()}</p>
                        <p>Rating: {list.rating}</p>
                                <button onClick={() => startEditing(list)}>Edit</button>
                            </div>
                        )}
                         {expandedList === list.listName && (
                            <div>
                                <h4>Superheroes:</h4>
                                <ul>
                                    {list.superheroes.map(hero => (
                                        <li key={hero.id}>
                                            {hero.name} ({hero.Publisher})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserLists;
