import { Router } from 'express';
import { checkFollowing } from './../../controllers/userController';
import restrictAuthenticated from '../../middleware/restrictAuthenticated';

const router = Router();

router.get('/follow/:userId', restrictAuthenticated(), checkFollowing);

export default router;
