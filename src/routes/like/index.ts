import { getPostLikes } from './../../controllers/postController/getPostLikes';
import { Router } from 'express';
import restrictAuthenticated from '../../middleware/restrictAuthenticated';
import { toggleLike } from '../../controllers/likeController';

const router = Router({ mergeParams: true });

router.route('/').get(getPostLikes).post(restrictAuthenticated(), toggleLike);
export default router;
