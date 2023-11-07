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


app.listen(PORT, () => {
    console.log(`Running server hosted at http://localhost:${PORT}`);
});