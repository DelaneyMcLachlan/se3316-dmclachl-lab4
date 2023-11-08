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
        const inputVal = document.getElementById('superHeroRaceInputVal').value;
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



document.getElementById('addNewListButton').addEventListener('click', async () => {
    const list = document.getElementById('listName').value;

    try {
        const rsp = await fetch('/lists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: list }),
        });

        if (rsp.status === 201) {
            alert('List successfully created!');
            showLists();
        } else {
            const err = await rsp.json();
            alert(err.message);
        }
    } catch (error) {
        console.error('Error creating a superhero new list:', error);
    }
});

async function showLists() {
    const lists = document.getElementById('allLists');
    lists.innerHTML = ''; 

    try {
        const rsp = await fetch('/lists');
        const shData = await rsp.json();
        shData.forEach(list => {
            const li = document.createElement('li');
            li.textContent = list.name;
            lists.appendChild(li);
        });
    } catch (error) {

        console.error('Error fetching superhero lists:', error);
    }
}

//array for all powers hard coded for search by power drop down button 
const powers = [
    "Agility",
    "Accelerated Healing",
    "Lantern Power Ring",
    "Dimensional Awareness",
    "Cold Resistance",
    "Durability",
    "Stealth",
    "Energy Absorption",
    "Flight",
    "Danger Sense",
    "Underwater breathing",
    "Marksmanship",
    "Weapons Master",
    "Power Augmentation",
    "Animal Attributes",
    "Longevity",
    "Intelligence",
    "Super Strength",
    "Cryokinesis",
    "Telepathy",
    "Energy Armor",
    "Energy Blasts",
    "Duplication",
    "Size Changing",
    "Density Control",
    "Stamina",
    "Astral Travel",
    "Audio Control",
    "Dexterity",
    "Omnitrix",
    "Super Speed",
    "Possession",
    "Animal Oriented Powers",
    "Weapon-based Powers",
    "Electrokinesis",
    "Darkforce Manipulation",
    "Death Touch",
    "Teleportation",
    "Enhanced Senses",
    "Telekinesis",
    "Energy Beams",
    "Magic",
    "Hyperkinesis",
    "Jump",
    "Clairvoyance",
    "Dimensional Travel",
    "Power Sense",
    "Shapeshifting",
    "Peak Human Condition",
    "Immortality",
    "Camouflage",
    "Element Control",
    "Phasing",
    "Astral Projection",
    "Electrical Transport",
    "Fire Control",
    "Projection",
    "Summoning",
    "Enhanced Memory",
    "Reflexes",
    "Invulnerability",
    "Energy Constructs",
    "Force Fields",
    "Self-Sustenance",
    "Anti-Gravity",
    "Empathy",
    "Power Nullifier",
    "Radiation Control",
    "Psionic Powers",
    "Elasticity",
    "Substance Secretion",
    "Elemental Transmogrification",
    "Technopath/Cyberpath",
    "Photographic Reflexes",
    "Seismic Power",
    "Animation",
    "Precognition",
    "Mind Control",
    "Fire Resistance",
    "Power Absorption",
    "Enhanced Hearing",
    "Nova Force",
    "Insanity",
    "Hypnokinesis",
    "Animal Control",
    "Natural Armor",
    "Intangibility",
    "Enhanced Sight",
    "Molecular Manipulation",
    "Heat Generation",
    "Adaptation",
    "Gliding",
    "Power Suit",
    "Mind Blast",
    "Probability Manipulation",
    "Gravity Control",
    "Regeneration",
    "Light Control",
    "Echolocation",
    "Levitation",
    "Toxin and Disease Control",
    "Banish",
    "Energy Manipulation",
    "Heat Resistance",
    "Natural Weapons",
    "Time Travel",
    "Enhanced Smell",
    "Illusions",
    "Thirstokinesis",
    "Hair Manipulation",
    "Illumination",
    "Omnipotent",
    "Cloaking",
    "Changing Armor",
    "Power Cosmic",
    "Biokinesis",
    "Water Control",
    "Radiation Immunity",
    "Vision - Telescopic",
    "Toxin and Disease Resistance",
    "Spatial Awareness",
    "Energy Resistance",
    "Telepathy Resistance",
    "Molecular Combustion",
    "Omnilingualism",
    "Portal Creation",
    "Magnetism",
    "Mind Control Resistance",
    "Plant Control",
    "Sonar",
    "Sonic Scream",
    "Time Manipulation",
    "Enhanced Touch",
    "Magic Resistance",
    "Invisibility",
    "Sub-Mariner",
    "Radiation Absorption",
    "Intuitive aptitude",
    "Vision - Microscopic",
    "Melting",
    "Wind Control",
    "Super Breath",
    "Wallcrawling",
    "Vision - Night",
    "Vision - Infrared",
    "Grim Reaping",
    "Matter Absorption",
    "The Force",
    "Resurrection",
    "Terrakinesis",
    "Vision - Heat",
    "Vitakinesis",
    "Radar Sense",
    "Qwardian Power Ring",
    "Weather Control",
    "Vision - X-Ray",
    "Vision - Thermal",
    "Web Creation",
    "Reality Warping",
    "Odin Force",
    "Symbiote Costume",
    "Speed Force",
    "Phoenix Force",
    "Molecular Dissipation",
    "Vision - Cryo",
    "Omnipresent",
    "Omniscient"
  ];
  

const powerSelect = document.getElementById('powerSelection');
powers.forEach(powerOption => {
    const selections = document.createElement('option');
    selections.value = powerOption;
    selections.textContent = powerOption;
    powerSelect.appendChild(selections);
});
 

document.getElementById('searchByPowerBtn').addEventListener('click', async () => { //event listener for power search button
    const powerSelection = powerSelect.value;
    try {
        const rsp = await fetch(`/searchByPower?power=${powerSelection}`);
        const shNames = await rsp.json();

        const divOfResults = document.getElementById('powersResults');
        divOfResults.innerHTML = ''; 
        shNames.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            divOfResults.appendChild(li);
        });
    } catch (err) {
        console.error('Cannot fetch heroes by power:', err);
    }
});

  
  document.addEventListener('DOMContentLoaded', () => {
    const serverURL = 'http://localhost:3000'; 
    const dropDownList = document.getElementById('superheroesListDropdown');
    const detailsDsplayBtn = document.getElementById('showDetailsButton');
    const displayHeroFields = document.getElementById('detailsDisplay');
    const addListButton = document.getElementById('addNewListButton');
    const allListsUl = document.getElementById('allLists');

    
    dropDownListUpdate();
    fetchSHList();

    addListButton.onclick = async () => {
        const listName = document.getElementById('listName').value;
        if (listName) {
            try {
                const rsp = await fetch(`${serverURL}/create-superhero-list-id`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ listName, superheroIds: [] }) 
                });
                const rslt = await rsp.json();
                console.log(rslt);
                dropDownListUpdate(); 
                fetchSHList(); 
            } catch (error) {
                console.error('Error adding superheros lists:', error);
            }
        } else {
            alert('Enter name of list.');
        }
    };


    detailsDsplayBtn.onclick = async () => { //display after fetching superhero info for list
        const listSelected = dropDownList.value;
        if (listSelected) {
            showSHInformation(listSelected);
        } else {
            alert('Please select a list.');
        }
    };
    dropDownList.addEventListener('change', function() {
        const selectedListName = this.value;
        if (selectedListName) {
            showSHInformation(selectedListName);
        }
    });

    async function dropDownListUpdate() {
        try {
            const rsp = await fetch(`${serverURL}/get-superhero-lists`);
            const availLists = await rsp.json();
            dropDownList.innerHTML = '<option value="">Select a list</option>'; 
            availLists.forEach(list => {
                dropDownList.innerHTML += `<option value="${list.name}">${list.name}</option>`;
            });
        } catch (err) {
            console.error('Error fetching lists:', err);
        }
    }

  
    async function fetchSHList() { //fetch and display lists
        try {
            const rsp = await fetch(`${serverURL}/get-superhero-lists`);
            const shLists = await rsp.json();
            allListsUl.innerHTML = shLists.map(list => `<li onclick="displaySuperheroDetails('${list.name}')">${list.name}</li>`).join('');
        } catch (err) {
            console.error('Error getting superhero lists:', err);
        }
    }

 
    async function showSHInformation(listName) { //fetch & display sh info
        try {
            const rsp = await fetch(`${serverURL}/get-superhero-details/${listName}`);
            const heroInfo = await rsp.json();
            displayHeroFields.innerHTML = ''; 
            heroInfo.forEach(hero => {
                const heroElement = document.createElement('div');
                heroElement.innerHTML = `
                <h3>${hero.name}</h3>
                <p>ID: ${hero.id}</p>
                <p>Gender: ${hero.Gender}</p>
                <p>Eye Color: ${hero['Eye color']}</p>
                <p>Race: ${hero.Race}</p>
                <p>Hair Color: ${hero['Hair color']}</p>
                <p>Height: ${hero.Height}</p>
                <p>Publisher: ${hero.Publisher}</p>
                <p>Skin Color: ${hero['Skin color']}</p>
                <p>Alignment: ${hero.Alignment}</p>
                <p>Weight: ${hero.Weight}</p>
            `;
                displayHeroFields.appendChild(heroElement);

                if (hero.powers) {
                    const pwrs = document.createElement('ul');
                    for (const [power, value] of Object.entries(hero.powers)) {
                        if (value === 'True') {
                            const itemPowers = document.createElement('li');
                            itemPowers.textContent = power;
                            pwrs.appendChild(itemPowers);
                        }
                    }
                    heroElement.appendChild(pwrs);
                }
            });
        } catch (err) {
            console.error('Error fetching superhero information', err);
        }
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const serverHost = 'http://localhost:3000'; 

    const addSHtoList = document.getElementById('addSuperheroesToList');

    addSHtoList.onsubmit = async (event) => {
        event.preventDefault(); 

        const listName = document.getElementById('addSuperheroesToListName').value;
        const superheroIds = document.getElementById('superheroIds').value.split(',').map(Number); 

        try {
            const rsp = await fetch(`${serverHost}/update-superhero-list`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ listName, superheroIds })
            });
            const rslt = await rsp.json();
            console.log(rslt);
        
        } catch (err) {
            console.error('Error adding superheroes list:', err);
        }
    };
}); 

showLists();

