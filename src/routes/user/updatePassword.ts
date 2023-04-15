import { Router } from 'express';
import { body } from 'express-validator';

import { updatePassword } from '../../controllers/userController';
import restrictAuthenticated from '../../middleware/restrictAuthenticated';
import isMatchedPasswords from '../../validators/isMatchedPasswords';
import validateRequest from '../../middleware/validateRequest';

const router = Router();

router.patch(
  '/update-password',
  restrictAuthenticated(),
  body('currentPassword')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters long'),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters long'),
  body('confirmPassword').custom(isMatchedPasswords),
  validateRequest,
  updatePassword
);

export default router;
