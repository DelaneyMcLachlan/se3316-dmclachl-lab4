import express from 'express'; //imports express module
import fs from 'fs'; //imports the file system module
import low from 'lowdb';//imports lowdb, json database
import FileSync from 'lowdb/adapters/FileSync.js';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
const ACCESS_TOKEN_SECRET = 'my_key'; // Replace with a secure, random string




const app = express(); //intitializes express app
const PORT = process.env.PORT || 3001; //defines the port number

app.use(cors());


//parses json data
const superHeroInfoData = JSON.parse(fs.readFileSync('JSONfiles/superhero_info.json', 'utf8'));
const superHerosPowerData = JSON.parse(fs.readFileSync('JSONfiles/superhero_powers.json', 'utf8'));

const adapter = new FileSync('db.json');  
const db = low(adapter);

const usersAdapter = new FileSync('Usersdb.json');
const usersDB = low(usersAdapter);

// Set defaults for the database file
usersDB.defaults({ users: [] }).write();

const reviewsAdapter = new FileSync('reviews.json');
const reviewsDB = low(reviewsAdapter);

// Set defaults for the reviews database file
reviewsDB.defaults({ listReviews: [] }).write();



db.defaults({ superheroLists: [] }).write();

  app.use(express.static('client'));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Testing');
});



app.post('/register',  body('username').trim().escape(),
body('email').isEmail().normalizeEmail(),
body('password').isLength({ min: 6 }),
body('nickname').trim().escape(),

async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
    
    try {

        

        const { username, password, email, nickname } = req.body;

        // Email validation regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Check if the email is in valid format
        if (!emailRegex.test(email)) {
            return res.status(400).send('Invalid email format');
        }

        // Check if the username or email already exists
        const isUserExist = usersDB.get('users').find({ username }).value() ||
                            usersDB.get('users').find({ email }).value();

        if (isUserExist) {
            return res.status(400).send('Username or email already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Creating a new user object with an empty 'lists' array and hashed password
        const newUser = { 
            username, 
            password: hashedPassword, // Store the hashed password
            email, 
            nickname, 
            disableFlag: 'enabled',
            lists: [] // An empty array to store user's lists
        };

        // Add user to DB
        usersDB.get('users').push(newUser).write();

        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Error in registering user');
    }
});
/* 
app.post('/register', async (req, res) => {
    try {
        const { username, password, email, nickname } = req.body;

        // Email validation regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Check if the email is in valid format
        if (!emailRegex.test(email)) {
            return res.status(400).send('Invalid email format');
        }

        // Check if the username or email already exists
        const isUserExist = usersDB.get('users').find({ username }).value() ||
                            usersDB.get('users').find({ email }).value();

        if (isUserExist) {
            return res.status(400).send('Username or email already exists');
        }

        // Creating a new user object with an empty 'lists' array
        const newUser = { 
            username, 
            password, 
            email, 
            nickname, 
            disableFlag: 'enabled',
            lists: [] // An empty array to store user's lists
        };

        // Add user to DB
        usersDB.get('users').push(newUser).write();

        res.status(200).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Error in registering user');
    }
}); */


app.post('/login', 
body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
async (req, res) => {
    const { email, password } = req.body;

    // Read users data from usersdb.json
    const usersData = JSON.parse(fs.readFileSync('\Usersdb.json', 'utf8'));

    // Find user by email
    const userFromDb = usersData.users.find(user => user.email === email);

    if (!userFromDb) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is disabled
    if (userFromDb.disableFlag === 'disabled') {
        return res.status(403).json({ error: 'User is disabled' });
    }

    try {
        // Compare the hashed password
        const match = await bcrypt.compare(password, userFromDb.password);

        if (match) {
            // Create user payload for JWT
            const userPayload = { id: userFromDb.id };

            // Sign the JWT token with the user payload
            const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_key');

            // Send the JWT token back to the client
            res.json({ accessToken });
        } else {
            // If password does not match
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
    




function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}
/* app.get('/protected', authenticateToken, (req, res) => {
    // Only accessible if the user is authenticated
});

const accessToken = localStorage.getItem('accessToken');
fetch('http://localhost:3001/protected', {
    headers: {
        'Authorization': `Bearer ${accessToken}`
    }
}); */

app.post('/updatepassword', async (req, res) => {
    const { email, newPassword } = req.body;

    let usersData = JSON.parse(fs.readFileSync('\Usersdb.json', 'utf8'));
    let userIndex = usersData.users.findIndex(user => user.email === email);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    try {
        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10); // Use bcrypt to hash the new password

        // Update the user's password with the hashed password
        usersData.users[userIndex].password = hashedNewPassword;

        // Write the updated users data back to the JSON file
        fs.writeFileSync('\Usersdb.json', JSON.stringify(usersData, null, 2));

        res.status(200).send('Password updated successfully');
    } catch (error) {
        res.status(500).send('Error in updating password');
    }
});




app.get('/users', (req, res) => {
    const users = usersDB.get('users').value();
    res.json(users);
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
/* app.post('/create-superhero-list-id', (req, res) => {
    const { listName, superheroIds } = req.body; 

    const existingList = db.get('superheroLists')
                         .find({ name: listName })
                         .value();

    if (existingList) {
        return res.status(400).json({ error: 'List name already exists. Choose a different name.' });
    }

    db.get('superheroLists')
    .push({ name: listName, superheroes: superheroIds }).write()



    res.status(201).json({ success: true, message: 'Newlist made' });
}); */


//curl -X PUT -H "Content-Type: application/json" -d "{\"listName\": \"myNewLists\", \"superheroIds\": [25, 5, 45]}" http://localhost:3000/update-superhero-list 
/* app.put('/update-superhero-list', (req, res) => {
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
}); */

/* 
app.post('/create-superhero-list-id', (req, res) => {
    const { username, listName, superheroIds } = req.body;

    const users = usersDB.get('users').value();
    const user = users.find(user => user.username === username);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const existingList = user.lists.find(list => list.listName === listName);

    if (existingList) {
        return res.status(400).json({ error: 'List name already exists. Choose a different name.' });
    }

    user.lists.push({ listName, superheroes: superheroIds, visibility: 'private' }); // Default visibility to 'private'
    usersDB.write(); // Make sure to write the changes to the DB

    res.status(201).json({ success: true, message: 'New list created' });
}); */

/* app.post('/create-superhero-list-id', (req, res) => {
    const { username, listName, superheroes } = req.body;

    // Fetch user from the database
    const user = usersDB.get('users').find({ username }).value();

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Check if list already exists
    const existingList = user.lists && user.lists.find(list => list.listName === listName);
    if (existingList) {
        return res.status(400).json({ error: 'List name already exists. Choose a different name.' });
    }

    // Add new list to the user's lists
    usersDB.get('users')
           .find({ username })
           .get('lists')
           .push({ listName, superheroes, visibility: 'private' })
           .write();

    res.status(201).json({ success: true, message: 'New list created' });
}); */


app.post('/create-superhero-list-id', (req, res) => {
    const { email, listName, superheroIds, description } = req.body;
    const currentTime = new Date().toISOString(); // Get the current time in ISO format

     // Fetch user from the database
     const user = usersDB.get('users').find({ email }).value();

     if (!user) {
         return res.status(404).json({ error: 'User not found' });
     }


    // Check if list already exists
    const existingList = user.lists && user.lists.find(list => list.listName === listName);
    if (existingList) {
        return res.status(400).json({ error: 'List name already exists. Choose a different name.' });
    }

    // Add new list to the user's lists
    usersDB.get('users')
           .find({ email })
           .get('lists')
           .push({ 
               listName, 
               superheroes: superheroIds, 
               visibility: 'private', 
               description: description || '', // Add description
               lastEdited: currentTime, // Add last edited time
               rating: 0 // Initialize rating as 0
           })
           .write();

    res.status(201).json({ success: true, message: 'New list created' });
});


app.put('/update-superhero-list', (req, res) => {
    const { email, listName, newListName, newSuperheroIds, newDescription } = req.body;
    const currentTime = new Date().toISOString();

    // Fetch user from the database
    const user = usersDB.get('users').find({ email }).value();

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Find the list to be updated
    const listIndex = user.lists.findIndex(list => list.listName === listName);
    if (listIndex === -1) {
        return res.status(404).json({ error: 'List not found' });
    }

    // Update the list
    user.lists[listIndex] = {
        ...user.lists[listIndex], // Keep existing data
        listName: newListName,
        superheroes: newSuperheroIds,
        description: newDescription,
        lastEdited: currentTime
    };

    // Save the updated user back to the database
    usersDB.get('users')
           .find({ email })
           .assign({ lists: user.lists })
           .write();

    res.json({ success: true, message: 'List updated successfully' });
});


app.delete('/delete-superhero-list', (req, res) => {
    const { email, listName } = req.body;

    // Fetch user from the database
    const user = usersDB.get('users').find({ email }).value();

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Check if the list exists
    const listIndex = user.lists.findIndex(list => list.listName === listName);
    if (listIndex === -1) {
        return res.status(404).json({ error: 'List not found' });
    }

    // Remove the list
    user.lists.splice(listIndex, 1);

    // Save the updated user back to the database
    usersDB.get('users')
           .find({ email })
           .assign({ lists: user.lists })
           .write();

    res.json({ success: true, message: 'List deleted successfully' });
});


/* app.put('/update-superhero-list', (req, res) => {
    const { username, listName, superheroIds } = req.body;

    const users = usersDB.get('users').value();
    const user = users.find(user => user.username === username);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const list = user.lists.find(list => list.listName === listName);

    if (!list) {
        return res.status(404).json({ error: 'List does not exist' });
    }

    list.superheroes = superheroIds; // Update the superheroes in the list
    usersDB.write(); // Make sure to write the changes to the DB

    res.status(200).json({ success: true, message: 'List updated' });
});
 */
function getSuperheroDetailsById(ids) {
    return ids.map(id => {
      // Find the superhero by ID
      const superhero = superHeroInfoData.find(hero => hero.id === id);
      if (!superhero) {
        // Return some default object or error if the superhero isn't found
        return { id, error: 'Superhero not found' };
      }
      // Return the found superhero data
      return superhero;
    });
  }

  app.get('/public-superhero-lists', (req, res) => {
    const users = usersDB.get('users').value();
  
    const publicLists = users.reduce((lists, user) => {
      if (user.lists && Array.isArray(user.lists)) {
        const publicUserLists = user.lists
          .filter(list => list.visibility === 'public')
          .map(list => {
            // Fetch superhero details for each ID in the list
            const superheroDetails = getSuperheroDetailsById(list.superheroes || []);
            return {
                listName: list.listName,
                creatorNickname: user.nickname, // Include the creator's nickname
                heroesCount: superheroDetails.length, // The number of superheroes
                superheroes: superheroDetails, // The details of the superheroes
                description: list.description,
                lastEdited: list.lastEdited,
                rating: list.rating
              
            };
          });
        return lists.concat(publicUserLists);
      }
      return lists;
    }, []);
  
    const sortedLists = publicLists.sort((a, b) => new Date(b.lastEdited) - new Date(a.lastEdited)).slice(0, 10);
  
    res.json(sortedLists);
  });

  app.post('/add-review', (req, res) => {
    const { listName, reviewerNickname, rating, comment } = req.body;

    // Find or create the list review entry
    let listReview = reviewsDB.get('listReviews').find({ listName }).value();

    if (!listReview) {
        listReview = { listName, reviews: [] };
        reviewsDB.get('listReviews').push(listReview).write();
    }

    // Add the new review
    reviewsDB.get('listReviews')
        .find({ listName })
        .get('reviews')
        .push({
            reviewerNickname,
            rating,
            comment,
            timestamp: new Date().toISOString()
        })
        .write();

    res.status(200).json({ message: 'Review added successfully' });
});

// Rest of your server code...

  app.get('/users/:email/lists', (req, res) => {
    // Extract the email from the route parameter
    const email = req.params.email;

    // Fetch the user from the database using email
    const user = usersDB.get('users').find({ email }).value();

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Optionally, you can filter the lists to show only public lists, 
    // or show all lists if it's the user's profile or the user has permissions
    const userLists = user.lists.map(list => {
        // Fetch superhero details for each ID in the list
        const superheroDetails = getSuperheroDetailsById(list.superheroes || []);
        return {
            ...list,
            superheroes: superheroDetails // Include detailed superhero information
        };
    });

    // Return user details and their lists
    res.json({
        username: user.username,
        nickname: user.nickname,
        lists: userLists
    });
});


app.get('/get-user-lists/:username', (req, res) => {
    const { username } = req.params;

    // Read users data from usersdb.json
    const usersData = JSON.parse(fs.readFileSync('Usersdb.json', 'utf8'));

    // Find the user by username
    const user = usersData.users.find(user => user.username === username);

    if (!user) {
        // If user is not found, return a 404 not found response
        return res.status(404).json({ error: 'User not found' });
    }

    // Return the user's lists
    res.json(user.lists);
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