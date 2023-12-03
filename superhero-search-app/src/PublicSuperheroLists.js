import React, { useState, useEffect } from 'react';

function PublicSuperheroLists() {
    const [lists, setLists] = useState([]);

    useEffect(() => {
        fetch('/public-superhero-lists')
            .then(response => response.json())
            .then(data => setLists(data))
            .catch(error => console.error('Error fetching public lists:', error));
    }, []);

    return (
        <div className="list-container">
            <h2>Public Superhero Lists</h2>
            <div className="lists">
                {lists.map(list => (
                    <div className="list-item" key={list.listName}>
                        <h3>{list.listName}</h3>
                        <p>Created by: {list.creatorNickname}</p>
                        <p>Number of Heroes: {list.heroesCount}</p>
                        <p>Average Rating: {list.rating}</p>
                        <p>Created: {new Date(list.lastEdited).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PublicSuperheroLists;

