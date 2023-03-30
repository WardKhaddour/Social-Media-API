import { Router } from 'express';
import { body } from 'express-validator';

import {
  checkAuthenticated,
  deleteMe,
  getUserData,
  updateMe,
} from '../../controllers/userController';

import restrictAuthenticated from '../../middleware/restrictAuthenticated';
import validateRequest from '../../middleware/validateRequest';

const router = Router();

router.get('/', restrictAuthenticated(), checkAuthenticated);
router.patch(
  '/',
  body('email')
    .optional({ checkFalsy: false })
    .isEmail()
    .withMessage('Please provide a valid E-Mail'),
  body('name').optional({ checkFalsy: false }),
  validateRequest,
  restrictAuthenticated(),
  updateMe
);

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
