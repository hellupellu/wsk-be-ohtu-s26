import express from 'express';
import {
  deleteCat,
  getAllCats,
  getCatById,
  postCat,
  putCat,
} from '../controllers/cat-controller.js';

// multer imports
import {createThumbnail, upload} from '../../middlewares/upload.js';
import {authenticateToken} from '../../middlewares/authentication.js';
import {body, param} from 'express-validator';
import {validationErrors} from '../../middlewares/error-handlers.js';

const catRouter = express.Router();

// Kaikki /api/v1/cats reitit
catRouter
  .route('/')
  .get(authenticateToken, getAllCats)
  .post(
    authenticateToken,
    upload.single('cat'),
    // TODO: add validators for all fields here
    body('cat_name').trim().isLength({min: 3, max: 50}),
    body('weight').isFloat({gt: 0}),
    body('birthdate').isISO8601({strict: true}),
    validationErrors,
    createThumbnail,
    postCat
  );
// Kaikki /api/v1/cats/:id reitit
catRouter
  .route('/:id')
  .get(getCatById)
  .delete(authenticateToken, deleteCat)
  .put(
    authenticateToken,
    param('id').isInt({min: 1}),
    body('cat_name').optional().trim().isLength({min: 3, max: 50}),
    body('weight').optional().isFloat({gt: 0}),
    body('birthdate').optional().isISO8601({strict: true}),
    validationErrors,
    putCat
  );

export default catRouter;

// Expressin middleware on kerros, joka käsittelee pyyntöä
// ennen kuin se pääsee reitille tai komtrolleriin

// 1. lisätään ensin oma tyhmä logger middleware
// reittikohtainen esimerkki

// 2. kaikille reiteillle on määritelty request time middleware joka saa muuttaa req objektia

// 3. Varsinainen tehtävänanto on käyttää Multeria
//  Multer on yksi tällainen middleware, joka osaa lukea multipart/form-data -pyynnöt ja tallentaa tiedostot serverille

// Myöhemmin lisätään esim. autentikointi, virheenkäsittely.

// upload.single('file'):
// tallentaa tiedoston esim. uploads/-kansioon ja
// lisää req.file-olion, jossa on esim.:

// {
//   fieldname: 'file',           // formin "name"
//   originalname: 'image.jpg',   // alkuperäinen nimi
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'uploads/',     // mihin tallennettiin
//   filename: 'a8f9234bd12.jpg', // generoitu nimi levyllä
//   path: 'uploads/a8f9234bd12.jpg',
//   size: 12345
// }

// Kaikki muut kentät (cat_name, weight, …) menevät  req.body-olioon.
