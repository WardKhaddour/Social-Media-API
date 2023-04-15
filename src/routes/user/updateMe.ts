import { Router } from 'express';
import { body } from 'express-validator';
import { updateMe } from './../../controllers/userController';
import restrictAuthenticated from '../../middleware/restrictAuthenticated';
import validateRequest from '../../middleware/validateRequest';
import uploadUserPhoto from '../../middleware/uploadUserPhoto';
import resizeUserPhoto from '../../middleware/resizeUserPhoto';

const router = Router();


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


export default router;
