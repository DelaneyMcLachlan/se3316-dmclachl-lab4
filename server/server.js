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

db.defaults({ superheroLists: [] }).write();

  app.use(express.static('client'));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Testing');
});


app.get('/search-superheroes', (req, res) => {
    const { field, value } = req.query;
  
    if (!field || !value) {
      return res.status(400).json({ error: 'Add field and value for search' });
    }
  
    let queriesResult;
    switch (field.toLowerCase()) {
      case 'name':
        queriesResult = superHeroInfoData.filter(hero => hero.name.toLowerCase().includes(value.toLowerCase()));
        break;
      case 'id':
        queriesResult = superHeroInfoData.filter(hero => hero.id === Number(value));
        break;
      case 'publisher':
        queriesResult = superHeroInfoData.filter(hero => hero.Publisher && hero.Publisher.toLowerCase().includes(value.toLowerCase()));
        break;
      case 'race':
        queriesResult = superHeroInfoData.filter(hero => hero.Race && hero.Race.toLowerCase().includes(value.toLowerCase()));
        break;
      default:
        return res.status(400).json({ error: 'Invalid field' });
    }
    res.json(queriesResult);
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


//const superheroPowersData = require('JSONfiles/superhero_powers.json');

app.get('/searchByPower', (req, res) => {
    const { power } = req.query;
    const shMatch = superHerosPowerData.filter(sh => sh[power] === "True").map(sh => sh.hero_names);
    res.json(shMatch);
});

//get first n number of matching IDs for a search pattern given an info field
//search?field=x&pattern=super&n=y
app.get('/search', (req, res) => {
    const { field, pattern, n: numberEntered } = req.query;

    console.log(`Field: ${field}, Pattern: ${pattern}, N: ${numberEntered}`);

    let shMatches = superHeroInfoData.filter(sh => {
        const value = String(sh[field]).toLowerCase();
        return value.includes(pattern.toLowerCase());
    });

    console.log(`N number of matching IDS for a search pattern for a given info field: ${JSON.stringify(shMatches)}`);

    let ids = shMatches.map(sh => sh.id);
 console.log(`IDs are: ${ids}`);

    if (numberEntered) {
        ids = ids.slice(0, parseInt(numberEntered, 10));
    }

    console.log(`First N IDs: ${ids}`);

    if (ids.length > 0) {
        res.json(ids);
    } else {
        res.status(404).send('Superhero not found');
    }
});



// POST endpoint to create a new superhero list by IDs
//curl request example
//curl -X POST -H "Content-Type: application/json" -d "{\"listName\": \"myNewLists\", \"superheroIds\": [1, 2, 3]}" http://localhost:3000/create-superhero-list-id
app.post('/create-superhero-list-id', (req, res) => {
    const { listName, superheroIds } = req.body; 

    const existingList = db.get('superheroLists')
                         .find({ name: listName })
                         .value();

    if (existingList) {
        return res.status(400).json({ error: 'List name already exists. Choose a different name.' });
    }

    db.get('superheroLists')
    .push({ name: listName, superheroes: superheroIds })
     .write()
    .then(() => console.log('Write successful'))
    .catch(err => console.error('Error writing to db:', err));


    res.status(201).json({ success: true, message: 'Newlist made' });
});


//curl -X PUT -H "Content-Type: application/json" -d "{\"listName\": \"myNewLists\", \"superheroIds\": [25, 5, 45]}" http://localhost:3000/update-superhero-list 
app.put('/update-superhero-list', (req, res) => {
    const { listName, superheroIds } = req.body;


    const existingList = db.get('superheroLists')
                         .find({ name: listName })
                         .value();

    if (!existingList) {
        return res.status(404).json({ error: 'List does not exist' });
    }

    db.get('superheroLists')
      .find({ name: listName })
      .assign({ superheroes: superheroIds }) 
      .write();

    res.status(200).json({ success: true, message: 'List updated' });
});

//shows available list
app.get('/get-superhero-lists', (req, res) => {
    const list = db.get('superheroLists').value();
    res.json(list);
});

app.get('/get-superhero-list/:listName', (req, res) => {
    const { listName } = req.params; 
    const listAvailable = db.get('superheroLists')
                   .find({ name: listName })
                   .value();

    if (listAvailable) {
        return res.json(listAvailable.superheroes); 
    }
    res.status(404).json({ error: 'List not found' });
});

//example curl command for backend
//curl -X DELETE http://localhost:3000/delete-superhero-list/xyz
app.delete('/delete-superhero-list/:listName', (req, res) => {
    const { listName } = req.params; 
    const existingList = db.get('superheroLists')
                         .find({ name: listName })
                         .value();
    if (existingList) {
        db.get('superheroLists')
          .remove({ name: listName })
          .write();
        return res.json({ success: true, message: 'List deleted' });
    }

    res.status(404).json({ error: 'List was not found' });
});


app.get('/get-superhero-details/:listName', async (req, res) => {

    const { listName } = req.params;

    const shList = db.get('superheroLists').find({ name: listName }).value();

    if (!shList) {
        return res.status(404).json({ error: 'List not found' });
    }
    const shInfo = shList.superheroes.map(id => {
        return superHeroInfoData.find(hero => hero.id === id);
    });
    const shPowers = shInfo.map(detail => {
        return superHerosPowerData.find(power => power.hero_names === detail.name);
    });
    const detailsObject = shInfo.map((detail, index) => {
        return { ...detail, powers: shPowers[index] };
    });

    res.json(detailsObject);
});



app.listen(PORT, () => {
    console.log(`Running server hosted at http://localhost:${PORT}`);
});