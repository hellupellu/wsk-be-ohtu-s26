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

const getUserById = async (req, res) => {
  const id = Number(req.params.id);
  const user = await findUserById(id);

  if (!user) {
    return res.status(404).json({message: 'Käyttäjää ei löytynyt'});
  }

  res.json(user);
};

const postUser = async (req, res) => {
  req.body.password = await bcrypt.hash(req.body.password, 10);
  const id = await addUser(req.body);

  if (!id) {
    return res.sendStatus(400);
  }

  res.status(201).json({user_id: id});
};

const putUser = async (req, res) => {
  const id = Number(req.params.id);
  const user = res.locals.user;

  // Tavallinen käyttäjä saa muokata vain omia tietojaan
  if (user.role !== 'admin' && user.user_id !== id) {
    return res.sendStatus(403);
  }

  const existingUser = await findUserById(id);
  if (!existingUser) {
    return res.status(404).json({error: 404, message: 'Not found.'});
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
    res.status(404).json({error: 404, message: 'Not found.'});
  }
};

const deleteUser = async (req, res) => {
  const id = Number(req.params.id);
  const user = res.locals.user;

  // Tavallinen käyttäjä saa poistaa vain omat tietonsa
  if (user.role !== 'admin' && user.user_id !== id) {
    return res.sendStatus(403);
  }

  const result = await removeUser(id);

  if (result) {
    res.json({message: 'User removed!'});
  } else {
    res.status(404).json({error: 404, message: 'Not found.'});
  }
};

export {getAllUsers, getUserById, postUser, putUser, deleteUser};
