import { getPost } from './../../controllers/postController';
import { Router } from 'express';
import { addNewPost, getAllPosts } from '../../controllers/postController';
import restrictAuthenticated from '../../middleware/restrictAuthenticated';
import likeRouter from '../like';
import commentRouter from '../comment';

const router = Router();

router.use('/:postId/like', likeRouter);
router.use('/:postId/comment', commentRouter);

router.get('/', getAllPosts);
router.get('/:postId', getPost);
router.post('/', restrictAuthenticated(), addNewPost);
export default router;
