import { Router } from 'express';
import { toggleFollowUser } from '../../controllers/userController';
import restrictAuthenticated from '../../middleware/restrictAuthenticated';
import checkAuthenticated from '../../middleware/checkAuthenticated';
import getUserFollowers from '../../controllers/userController/getUserFollowers';
import getUserFollowing from '../../controllers/userController/getUserFollowing';

const router = Router();

router.patch('/follow/:userId', restrictAuthenticated(), toggleFollowUser);
router.get('/:userId/followers', restrictAuthenticated(), getUserFollowers);
router.get('/:userId/following', restrictAuthenticated(), getUserFollowing);

export default router;
