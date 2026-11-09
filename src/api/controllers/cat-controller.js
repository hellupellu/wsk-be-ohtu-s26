import {addCat, findCatById, listAllCats} from '../models/cat-model.js';

const getAllCats = (req, res) => {
  //const cats = [{cat_id: 1, name: 'Misu'}];
  res.json(listAllCats());
};

const getCatById = (req, res) => {
  //console.log(req);
  // PALAUTTAKAA VAIN YKSI KISSA req.params.id haulla
  // 1. Haetaan ID URL-parametrista ja muunnetaan numeroksi
  const id = Number(req.params.id);
  //console.log(id);
  // 2. Haetaan kissa modelilta
  const cat = findCatById(id);
  // 3. Jos kissaa ei löydy, palautetaan 404
  if (!cat) {
    return res.status(404).json({message: 'Kissaa ei löytynyt'});
  }
  // 4. Jos kissa löytyy, palautetaan sen tiedot
  res.json(cat);
};

const postCat = (req, res) => {
  console.log('request', req.body);
  console.log(req.file);
  console.log(req.file.filename);
  req.body.filename = req.file.filename;

  const result = addCat(req.body);
  if (result) {
    res.status(201);
    res.json({message: 'New cat added.', result});
  } else {
    res.sendStatus(400);
  }
};

const deleteCat = (req, res) => {
  res.json({message: 'Cat item deleted.'});
};

const putCat = (req, res) => {
  res.json({message: 'Cat item updated.'});
};

export {getAllCats, getCatById, postCat, deleteCat, putCat};
