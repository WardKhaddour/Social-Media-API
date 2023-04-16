import { Router } from 'express';
import checkAuthenticated from './checkAuthenticated';
import confirmEmail from './confirmEmail';
import deleteMe from './deleteMe';
import logout from './logout';
import updateMe from './updateMe';
import updatePassword from './updatePassword';
import getUserById from './getUserById';
import toggleFollow from './toggleFollow';
import checkFollowing from './checkFollowing';

const router = Router();

router.use(checkAuthenticated);
router.use(confirmEmail);
router.use(deleteMe);
router.use(logout);
router.use(updateMe);
router.use(updatePassword);
router.use(getUserById);
router.use(toggleFollow);
router.use(checkFollowing);
export default router;
