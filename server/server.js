import express from 'express'; //imports express module
import fs from 'fs'; //imports the file system module
import low from 'lowdb';//imports lowdb, json database
import FileSync from 'lowdb/adapters/FileSync.js';


const app = express(); //intitializes express app
const PORT = 3000; //defines the port number

//parses json data
const superHeroInfoData = JSON.parse(fs.readFileSync('JSONfiles/superhero_info.json', 'utf8'));
const superHerosPowerData = JSON.parse(fs.readFileSync('JSONfiles/superhero_powers.json', 'utf8'));

const adapter = new FileSync('db.json');  
const db = low(adapter);

app.get('/', (req, res) => {
    res.send('Testing');
});


//get all superhero info for a given superhero id
app.get('/superhero/:id', (req, res) => {
    const idNumber = parseInt(req.params.id);
    const hero = superHeroInfoData.find(sh => sh.id === idNumber);
    if (hero) {
        res.json(hero);
    } else {
        res.status(404).send('Superhero not found given ID');
    }
});

//get all powers for a given superhero ID
app.get('/superhero/:id/powers', (req, res) => {
    const id = parseInt(req.params.id);
    const shPowers = superHerosPowerData.find(sh => sh.hero_names === superHeroInfoData[id].name);
    if (shPowers) {
        res.json(shPowers);
    } else {
        res.status(404).send('Invalid: Hero powers not found');
    }
});



//get all available publisher names
app.get('/publishers', (req, res) => {
    const pblisher = [...new Set(superHeroInfoData.map(sh => sh.Publisher))];
    res.json(pblisher);
});

//get names of heroes with powers
app.get('/powers', (req, res) => {
    const heroPowers = superHeroInfoData[0];
    const pwrs = Object.keys(heroPowers).filter(key => key !== "hero_names");
    res.json(pwrs);
});

app.listen(PORT, () => {
    console.log(`Running server hosted at http://localhost:${PORT}`);
});