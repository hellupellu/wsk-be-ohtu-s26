import {
  addUser,
  findUserById,
  listAllUsers,
  modifyUser,
  removeUser,
} from '../models/user-model.js';
import bcrypt from 'bcrypt';

const getAllUsers = async (req, res) => {
  res.json(await listAllUsers());
};

const getUserById = async (req, res, next) => {
  const id = Number(req.params.id);
  const user = await findUserById(id);

  if (!user) {
    const error = new Error('Käyttäjää ei löytynyt');
    error.status = 404;
    return next(error);
  }

  res.json(user);
};

const postUser = async (req, res, next) => {
  req.body.password = await bcrypt.hash(req.body.password, 10);
  const id = await addUser(req.body);

  if (!id) {
    const error = new Error('User registration failed');
    error.status = 400;
    return next(error);
  }

  res.status(201).json({user_id: id});
};

const putUser = async (req, res, next) => {
  const id = Number(req.params.id);
  const user = res.locals.user;

  // Tavallinen käyttäjä saa muokata vain omia tietojaan
  if (user.role !== 'admin' && user.user_id !== id) {
    const error = new Error('Forbidden');
    error.status = 403;
    return next(error);
  }

  const existingUser = await findUserById(id);
  if (!existingUser) {
    const error = new Error('Not found.');
    error.status = 404;
    return next(error);
  }

  const updatedUser = {
    name: req.body.name ?? existingUser.name,
    username: req.body.username ?? existingUser.username,
    email: req.body.email ?? existingUser.email,
    role:
      user.role === 'admin'
        ? (req.body.role ?? existingUser.role)
        : existingUser.role,
  };

  const result = await modifyUser(id, updatedUser);

  if (result) {
    res.json({message: 'User updated!'});
  } else {
    const error = new Error('Not found.');
    error.status = 404;
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const id = Number(req.params.id);
  const user = res.locals.user;

  // Tavallinen käyttäjä saa poistaa vain omat tietonsa
  if (user.role !== 'admin' && user.user_id !== id) {
    const error = new Error('Forbidden');
    error.status = 403;
    return next(error);
  }

  const result = await removeUser(id);

  if (result) {
    res.json({message: 'User removed!'});
  } else {
    const error = new Error('Not found.');
    error.status = 404;
    return next(error);
  }
};

export {getAllUsers, getUserById, postUser, putUser, deleteUser};
