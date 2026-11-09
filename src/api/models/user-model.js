import promisePool from '../../utils/database.js';

const listAllUsers = async () => {
  const [rows] = await promisePool.query(
    'SELECT user_id, name, username, email, role FROM wsk_users'
  );
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.execute(
    'SELECT user_id, name, username, email, role FROM wsk_users WHERE user_id = ?',
    [id]
  );
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addUser = async (user) => {
  const {name, username, email, role, password} = user;

  const sql = `INSERT INTO wsk_users (name, username, email, password, role)
               VALUES (?, ?, ?, ?, ?)`;

  const params = [name, username, email, password, role];
  const [result] = await promisePool.execute(sql, params);

  if (result.affectedRows === 0) {
    return false;
  }

  return result.insertId;
};

const modifyUser = async (id, user) => {
  const {name, username, email, role} = user;

  const sql = `UPDATE wsk_users
               SET name = ?, username = ?, email = ?, role = ?
               WHERE user_id = ?`;

  const params = [name, username, email, role, id];
  const [result] = await promisePool.execute(sql, params);

  return result.affectedRows > 0;
};

const removeUser = async (id) => {
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute('DELETE FROM wsk_cats WHERE owner = ?', [id]);

    const [result] = await connection.execute(
      'DELETE FROM wsk_users WHERE user_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return false;
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export {listAllUsers, findUserById, addUser, modifyUser, removeUser};
