import {addUser, findUserById, listAllUsers} from '../models/user-model.js';

const getAllUsers = (req, res) => {
  res.json(listAllUsers());
};

const getUserById = (req, res) => {
  const id = Number(req.params.id);
  const user = findUserById(id);

  if (!user) {
    return res.status(404).json({message: 'Käyttäjää ei löytynyt'});
  }

  res.json(user);
};

const postUser = (req, res) => {
  const id = addUser(req.body);
  res.status(201).json({user_id: id});
};

const putUser = (req, res) => {
  res.json({message: 'User item updated.'});
};

const deleteUser = (req, res) => {
  res.json({message: 'User item deleted.'});
};

export {getAllUsers, getUserById, postUser, putUser, deleteUser};
