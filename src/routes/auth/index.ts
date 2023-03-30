import { Router } from 'express';

import signupRouter from './signup';
import loginRouter from './login';
import forgotPasswordRouter from './forgotPassword';
import resetPasswordRouter from './resetPassword';
import updatePasswordRouter from './updatePassword';
import logoutRouter from './logout';

const router = Router();

router.use(loginRouter);
router.use(signupRouter);
router.use(forgotPasswordRouter);
router.use(resetPasswordRouter);
router.use(updatePasswordRouter);
router.use(logoutRouter);
export default router;
