import {
  addUser,
  findUserById,
  listAllUsers,
  modifyUser,
  removeUser,
} from '../models/user-model.js';

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
  const id = await addUser(req.body);

  if (!id) {
    return res.sendStatus(400);
  }

  res.status(201).json({user_id: id});
};

const putUser = async (req, res) => {
  const result = await modifyUser(Number(req.params.id), req.body);

  if (result) {
    res.json({message: 'User updated!'});
  } else {
    res.status(404).json({error: 404, message: 'Not found.'});
  }
};

const deleteUser = async (req, res) => {
  const result = await removeUser(Number(req.params.id));

  if (result) {
    res.json({message: 'User removed!'});
  } else {
    res.status(404).json({error: 404, message: 'Not found.'});
  }
};
export {getAllUsers, getUserById, postUser, putUser, deleteUser};
