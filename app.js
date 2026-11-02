import express from 'express';
const hostname = '127.0.0.1';
const port = 3000;
const app = express();

// mock data
const cats = [
  {
    cat_id: 1,
    name: 'Misu',
    birthdate: '2020-01-01',
    weight: 4.5,
    owner: 'Helena',
    image: 'https://placekittens.com/320/240',
  },
  {
    cat_id: 2,
    name: 'Kisu',
    birthdate: '2021-05-15',
    weight: 3.2,
    owner: 'Mikko',
    image: 'https://placekittens.com/320/240',
  },
  {
    cat_id: 3,
    name: 'Pörrö',
    birthdate: '2019-09-10',
    weight: 5.0,
    owner: 'Liisa',
    image: 'https://placekittens.com/320/240',
  },
];

app.use(express.static('public'));
//app.use('/images', express.static('public'));

// needed for reading request body in JSON format
app.use(express.json());

// käynnistetään HTTP- palvelimen kuuntelemaan porttia
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// express kutsuu reitin callback-funktiota
// req sisältää pyyntöä koskevat tiedot ja res vastaustoiminnot
app.get('/kissa', (req, res) => {
  //res.sendStatus(404);
  res.send('Welcome to my REST API mororo!');
});

// cat_id: number
// name: string
// birthdate: string
// weight: number
// owner: string
// image: string, URL to an image (e.g. https://loremflickr.com/320/240/cat)

app.get('/api/v1/cats', (req, res) => {
  //const cats = [{cat_id: 1, name: 'Misu'}];
  res.json(cats);
});

// GET http://localhost:3000/api/resource/99
// property name (id) is set in the route definition
app.get('/api/v1/cats/:id', (req, res) => {
  //console.log(req);

  // PALAUTTAKAA VAIN YKSI KISSA req.params.id haulla

  // 1. Haetaan ID URL-parametrista ja muunnetaan numeroiksi
  const id = Number(req.params.id);
  console.log(id);

  // 2. Etsitään kissa taulukosta
  // find palauttaa ensimmäisen löytyneen olion tai undefined
  const cat = cats.find((cat) => cat.cat_id === id);

  // 3. Jos kissaa ei löydy, palautetaan 404
  if (!cat) {
    return res.status(404).json({message: 'Kissaa ei löytynyt'});
  }

  // 4. Jos kissa löytyy, palautetaan sen tiedot
  res.json(cat);

  /*
  console.log('path variables', req.params);
  if (req.params.id === '99') {
    const myData = {
      title: 'This is a specific item, id: ' + req.params.id,
      description: 'Just some dummy data here',
    };
    res.json(myData);
  } else {
    res.sendStatus(404);
  }
  */
});

app.post('/api/v1/cats', (req, res) => {
  console.log(req.body);
  res.sendStatus(201);
});
