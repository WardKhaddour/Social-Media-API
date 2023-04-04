import { Router } from 'express';
import { body } from 'express-validator';
import { forgotPassword } from '../../controllers/authController';
import restrictHuman from '../../middleware/restrictHuman';

const router = Router();

router.post(
  '/forgot-password',
  restrictHuman,
  body('email').isEmail().withMessage('Please provide a valid E-Mail'),
  forgotPassword
);

export default router;
