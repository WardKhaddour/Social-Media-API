import { Router } from 'express';
import { body } from 'express-validator';
import { resetPassword } from '../../controllers/authController';
import validateRequest from '../../middleware/validateRequest';
import isMatchedPasswords from '../../validators/isMatchedPasswords';

const router = Router();

router.patch(
  '/reset-password/:token',
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters long'),
  body('confirmPassword').custom(isMatchedPasswords),
  validateRequest,
  resetPassword
);

export default router;
