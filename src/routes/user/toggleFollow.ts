import { Router } from 'express';
import { toggleFollowUser } from './../../controllers/userController';
import restrictAuthenticated from '../../middleware/restrictAuthenticated';

const router = Router();

router.patch('/follow/:userId', restrictAuthenticated(), toggleFollowUser);

export default router;
