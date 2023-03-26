import { Router } from 'express';
import { body } from 'express-validator';
import { forgotPassword } from '../../controllers/authController';

const router = Router();

router.post(
  '/forgot-password',
  body('email').isEmail().withMessage('Please provide a valid E-Mail'),
  forgotPassword
);

export default router;
