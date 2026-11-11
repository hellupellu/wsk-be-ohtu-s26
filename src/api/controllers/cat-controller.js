import {
  addCat,
  findCatById,
  listAllCats,
  modifyCat,
  removeCat,
  findCatByUserId,
} from '../models/cat-model.js';

const getAllCats = async (req, res) => {
  //const cats = [{cat_id: 1, name: 'Misu'}];
  console.log('Ollaan nyt controllerissa');
  // res.json(listAllCats());
  const cats = await listAllCats();
  res.json(cats);
};

const getCatById = async (req, res, next) => {
  // 2. Haetaan kissa modelilta
  const cat = await findCatById(req.params.id);
  // 3. Jos kissaa ei löydy, palautetaan 404
  if (!cat) {
    const error = new Error('Kissaa ei löytynyt');
    error.status = 404;
    return next(error);
  }
  // 4. Jos kissa löytyy, palautetaan sen tiedot
  res.json(cat);
};

const postCat = async (req, res, next) => {
  // check if file is rejected by multer
  if (!req.file) {
    const error = new Error('Invalid or missing file');
    error.status = 400;
    return next(error);
  }

  console.log('request', req.body);
  console.log(req.file);
  console.log(req.file.filename);
  req.body.filename = req.file.filename;
  req.body.owner = res.locals.user.user_id;

  const result = await addCat(req.body);
  if (result) {
    res.status(201);
    res.json({message: 'New cat added.', result});
  } else {
    res.sendStatus(400);
  }
};

const deleteCat = async (req, res, next) => {
  const id = Number(req.params.id);
  const user = res.locals.user;
  console.log('user', user);

  const result = await removeCat(id, user);
  if (result) {
    res.json({message: 'Cat removed!'});
  } else {
    const error = new Error('Not found.');
    error.status = 404;
    return next(error);
  }
};

const putCat = async (req, res, next) => {
  // in real life, all input data (req.body) should be validated before using it
  const result = await modifyCat(
    Number(req.params.id),
    req.body,
    res.locals.user
  );
  if (result) {
    res.json({message: 'Cat updated!'});
  } else {
    const error = new Error('Not found.');
    error.status = 404;
    return next(error);
  }
};

const getCatsByUserId = async (req, res) => {
  const cats = await findCatByUserId(req.params.id);
  res.json(cats);
};

export {getAllCats, getCatById, postCat, deleteCat, putCat, getCatsByUserId};
