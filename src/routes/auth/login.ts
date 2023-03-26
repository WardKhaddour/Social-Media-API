import { Router } from 'express';
import { body } from 'express-validator';
import { login } from '../../controllers/authController';
import validateRequest from '../../middleware/validateRequest';

const router = Router();

router.post(
  '/login',
  body('email').isEmail().withMessage('Please provide a valid E-Mail'),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters long'),
  validateRequest,
  login
);

export default router;
