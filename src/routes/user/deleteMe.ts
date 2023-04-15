import { Router } from 'express';
import { body } from 'express-validator';
import { deleteMe } from './../../controllers/userController';
import restrictAuthenticated from '../../middleware/restrictAuthenticated';
import validateRequest from '../../middleware/validateRequest';

const router = Router();

router.delete(
  '/',
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters long'),
  validateRequest,
  restrictAuthenticated({ withPassword: true }),
  deleteMe
);

export default router;
