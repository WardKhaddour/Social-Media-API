import { Router } from 'express';
import { toggleFollowUser } from '../../controllers/userController';
import restrictAuthenticated from '../../middleware/restrictAuthenticated';
import checkAuthenticated from '../../middleware/checkAuthenticated';
import getUserFollowers from '../../controllers/userController/getUserFollowers';
import getUserFollowing from '../../controllers/userController/getUserFollowing';

const router = Router();

router.patch('/follow/:userId', restrictAuthenticated(), toggleFollowUser);
router.get('/:userId/followers', checkAuthenticated(), getUserFollowers);
router.get('/:userId/following', checkAuthenticated(), getUserFollowing);

export default router;
