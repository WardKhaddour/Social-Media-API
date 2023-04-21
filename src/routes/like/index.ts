import { checkLike } from './../../controllers/likeController';
import { Router } from 'express';
import restrictAuthenticated from '../../middleware/restrictAuthenticated';
import { toggleLike } from '../../controllers/likeController';

const router = Router({ mergeParams: true });

router.route('/').all(restrictAuthenticated()).get(checkLike).post(toggleLike);
export default router;
