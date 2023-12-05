import React, { useState, useEffect } from 'react';

function PublicSuperheroLists() {
    const [lists, setLists] = useState([]);
    const [expandedList, setExpandedList] = useState(null);
    const [expandedHero, setExpandedHero] = useState(null);

    useEffect(() => {
        fetch('/public-superhero-lists')
            .then(response => response.json())
            .then(data => setLists(data))
            .catch(error => console.error('Error fetching public lists:', error));
    }, []);

    const toggleExpandList = (listName) => {
        setExpandedList(expandedList === listName ? null : listName);
    };

    const toggleExpandHero = (heroId) => {
        setExpandedHero(expandedHero === heroId ? null : heroId);
    };

    const renderSuperheroDetails = (superheroes) => {
        if (!superheroes || superheroes.length === 0) return 'No superheroes in this list.';
        return superheroes.map((hero) => (
            <div key={hero.id} className="superhero-detail" onClick={() => toggleExpandHero(hero.id)}>
                <p> <b>Name:</b> {hero.name} <b>Publisher: </b>{hero.Publisher}</p>
                {expandedHero === hero.id && (
                    <div>
                        <p>Gender: {hero.Gender}</p>
                        <p>Eye color: {hero["Eye color"]}</p>
                        <p>Race: {hero.Race}</p>
                        <p>Hair color: {hero["Hair color"]}</p>
                        <p>Height: {hero.Height} cm</p>
                        <p>Skin color: {hero["Skin color"] !== "-" ? hero["Skin color"] : "Not specified"}</p>
                        <p>Alignment: {hero.Alignment}</p>
                        <p>Weight: {hero.Weight} kg</p>
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div className="list-container">
            <h2>Public Superhero Lists</h2>
            <div className="lists">
                {lists.map((list, index) => (
                    <div className="list-item" key={index}>
                        <h3 onClick={() => toggleExpandList(list.listName)}>{list.listName}</h3>
                        <p>Created by: {list.creatorNickname}</p>
                        <p>Number of Heroes: {list.heroesCount}</p>
                        <p>Average Rating: {list.rating.toFixed(1)}</p>
                        <p>Last Edited: {new Date(list.lastEdited).toLocaleString()}</p>
                        {expandedList === list.listName && (
                            <div className="expanded-content">
                                <p>Description: {list.description}</p>
                                <div>Heroes: {renderSuperheroDetails(list.superheroes)}</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PublicSuperheroLists;
