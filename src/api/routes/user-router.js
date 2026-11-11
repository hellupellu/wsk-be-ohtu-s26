import express from 'express';
import {
  getAllUsers,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.js';
import {getCatsByUserId} from '../controllers/cat-controller.js';
import {authenticateToken} from '../../middlewares/authentication.js';
import {body, param} from 'express-validator';
import {validationErrors} from '../../middlewares/error-handlers.js';

const userRouter = express.Router();

// Kaikki /api/v1/users reitit
userRouter
  .route('/')
  .get(getAllUsers)
  .post(
    body('name').trim().isLength({min: 3, max: 200}),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('required')
      .isEmail()
      .withMessage('must be valid email address'),
    body('username').trim().isLength({min: 3, max: 20}).isAlphanumeric(),
    body('password').isLength({min: 8}),
    validationErrors,
    postUser
  );

// Kaikki /api/v1/users/:id reitit
userRouter
  .route('/:id')
  .get(param('id').isInt({min: 1}), validationErrors, getUserById)
  .put(
    authenticateToken,
    param('id').isInt({min: 1}),
    body('name').optional().trim().isLength({min: 3, max: 200}),
    body('username')
      .optional()
      .trim()
      .isLength({min: 3, max: 20})
      .isAlphanumeric(),
    body('email').optional().trim().isEmail(),
    body('role').optional().isIn(['user', 'admin']),
    validationErrors,
    putUser
  )
  .delete(
    authenticateToken,
    param('id').isInt({min: 1}),
    validationErrors,
    deleteUser
  );

userRouter.get(
  '/:id/cats',
  param('id').isInt({min: 1}),
  validationErrors,
  getCatsByUserId
);

export default userRouter;
