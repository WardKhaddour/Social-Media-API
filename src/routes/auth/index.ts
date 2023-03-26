import { Router } from 'express';

import signupRouter from './signup';
import loginRouter from './login';
import forgotPasswordRouter from './forgotPassword';
import resetPasswordRouter from './resetPassword';
import updatePasswordRouter from './updatePassword';

const router = Router();

router.use(loginRouter);
router.use(signupRouter);
router.use(forgotPasswordRouter);
router.use(resetPasswordRouter);
router.use(updatePasswordRouter);

export default router;
