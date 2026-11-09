import express from 'express';
import {
  getAllUsers,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.js';
import {getCatsByUserId} from '../controllers/cat-controller.js';

const userRouter = express.Router();

// Kaikki /api/v1/users reitit
userRouter.route('/').get(getAllUsers).post(postUser);

// Kaikki /api/v1/users/:id reitit
userRouter.route('/:id').get(getUserById).put(putUser).delete(deleteUser);

userRouter.get('/:id/cats', getCatsByUserId);

export default userRouter;
