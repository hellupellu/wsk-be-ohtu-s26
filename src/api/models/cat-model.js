// Note: db functions are async and must be called with await from the controller
// How to handle errors in controller?
import promisePool from '../../utils/database.js';

const listAllCats = async () => {
  const [rows] = await promisePool.query(
    'SELECT wsk_cats.*, wsk_users.name AS owner_name FROM wsk_cats JOIN wsk_users ON wsk_cats.owner = wsk_users.user_id'
  );
  // TODO: liitä kyselyyn myös haku käyttäjätaulusta, ja korvaa palautettavasta
  // objektista user_id usernamella
  console.log('rows', rows);
  return rows;
};

const findCatById = async (id) => {
  const [rows] = await promisePool.execute(
    'SELECT wsk_cats.*, wsk_users.name AS owner_name FROM wsk_cats JOIN wsk_users ON wsk_cats.owner = wsk_users.user_id WHERE wsk_cats.cat_id = ?',
    [id]
  );
  // TODO: liitä kyselyyn myös haku käyttäjätaulusta, ja korvaa palautettavasta
  // objektista user_id usernamella
  console.log('rows', rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const findCatByUserId = async (userId) => {
  const [rows] = await promisePool.execute(
    'SELECT * FROM wsk_cats WHERE owner = ?',
    [userId]
  );
  return rows;
};

const addCat = async (cat) => {
  const {cat_name, weight, owner, filename, birthdate} = cat;
  const sql = `INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [cat_name, weight, owner, filename, birthdate];
  const [result] = await promisePool.execute(sql, params);
  console.log('insert query result', result);
  if (result.affectedRows === 0) {
    return false;
  }
  return {cat_id: result.insertId};
};

const modifyCat = async (id, cat) => {
  const sql = promisePool.format(`UPDATE wsk_cats SET ? WHERE cat_id = ?`, [
    cat,
    id,
  ]);
  const rows = await promisePool.execute(sql);
  console.log('rows', rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return true;
};

const removeCat = async (id) => {
  const [rows] = await promisePool.execute(
    'DELETE FROM wsk_cats WHERE cat_id = ?',
    [id]
  );
  console.log('rows', rows);
  if (rows.affectedRows === 0) {
    return false;
  }
  return true;
};

export {
  listAllCats,
  findCatById,
  addCat,
  modifyCat,
  removeCat,
  findCatByUserId,
};
