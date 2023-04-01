import { Router } from 'express';
import { body } from 'express-validator';
import validateRequest from '../../middleware/validateRequest';
import {
  confirmEmail,
  resendConfirmToken,
} from '../../controllers/authController';

const router = Router();

router.patch('/confirm-email/:token', confirmEmail);
router.post(
  '/resend-confirm-token',
  body('email').isEmail(),
  validateRequest,
  resendConfirmToken
);

export default router;
