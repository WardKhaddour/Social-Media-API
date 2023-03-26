import { Router } from 'express';
import { body } from 'express-validator';
import { signup } from '../../controllers/authController';
import isMatchedPasswords from '../../validators/isMatchedPasswords';
import validateRequest from '../../middleware/validateRequest';

const router = Router();

router.post(
  '/signup',
  body('email').isEmail().withMessage('Please provide a valid E-Mail'),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters long'),
  body('confirmPassword').custom(isMatchedPasswords),
  validateRequest,
  signup
);

export default router;
