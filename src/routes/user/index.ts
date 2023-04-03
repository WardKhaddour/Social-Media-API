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
import uploadUserPhoto from '../../middleware/uploadUserPhoto';
import resizeUserPhoto from '../../middleware/resizeUserPhoto';

const router = Router();

router.get('/', restrictAuthenticated(), checkAuthenticated);
router.patch(
  '/',
  uploadUserPhoto,
  body('email')
    .optional({ checkFalsy: false })
    .isEmail()
    .withMessage('Please provide a valid E-Mail'),
  body('name').optional({ checkFalsy: false }),
  restrictAuthenticated(),
  validateRequest,
  resizeUserPhoto,
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
