
document.addEventListener('DOMContentLoaded', () => {
    const serverURL = 'http://localhost:3000'; 

    // attach event listener to the 'search by field buttons
    document.getElementById('searchbyNameBtn').addEventListener('click', () => {
        const inputVal = document.getElementById('superheroNameInputVal').value;
        searchForSH('name', inputVal);
    });

    document.getElementById('searchByIDBtn').addEventListener('click', () => {
        const inputVal = document.getElementById('superheroIDInputVal').value;
        searchForSH('id', inputVal);
    });

    document.getElementById('searchByPublisherBtn').addEventListener('click', () => {
        const inputVale = document.getElementById('publisherInputVal').value;
        searchForSH('publisher', inputVale);
    });
    document.getElementById('searchByRaceBtn').addEventListener('click', () => {
        const inputVal = document.getElementById('superHeroRaceInputValt').value;
        searchForSH('race', inputVal);
    });

  
    async function searchForSH(field, value) {   //async function searches for heroes
        try {
            const rspnse = await fetch(`${serverURL}/search-superheroes?field=${field}&value=${value}`);
            const searchResult = await rspnse.json();
            displaySearchResults(searchResult);
        } catch (err) {
            console.error('Error searching for heroes:', err);
        }
    }


function displaySearchResults(results) { // function to hero search results
    const shResult = document.getElementById('allSearchResults');
    shResult.innerHTML = ''; 

    results.forEach(hero => {
        const shListItem = document.createElement('li');
        shListItem.innerHTML = `
            <strong>${hero.name} ID: ${hero.id}</strong><br>
            Publisher: ${hero.Publisher}<br>
            Gender: ${hero.Gender}<br>
            Eye color: ${hero['Eye color']}<br>
            Race: ${hero.Race}<br>
            Hair color: ${hero['Hair color']}<br>
            Height: ${hero.Height !== -99 ? hero.Height + ' cm' : 'Unknown'}<br>
            Skin color: ${hero['Skin color']}<br>
            Alignment: ${hero.Alignment}<br>
            Weight: ${hero.Weight}
        `;
        shResult.appendChild(shListItem);
    });
}

});
