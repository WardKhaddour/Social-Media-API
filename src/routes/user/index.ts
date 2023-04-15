import { Router } from 'express';
import checkAuthenticated from './checkAuthenticated';
import confirmEmail from './confirmEmail';
import deleteMe from './deleteMe';
import logout from './logout';
import updateMe from './updateMe';
import updatePassword from './updatePassword';
import getUserById from './getUserById';

const router = Router();

router.use(checkAuthenticated);
router.use(confirmEmail);
router.use(deleteMe);
router.use(logout);
router.use(updateMe);
router.use(updatePassword);
router.use(getUserById);

export default router;
