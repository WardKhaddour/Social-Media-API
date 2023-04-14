import {
  getPost,
  getAllPosts,
  addNewPost,
  aliasMostPopular,
  updatePost,
} from './../../controllers/postController';
import { Router } from 'express';

import restrictAuthenticated from '../../middleware/restrictAuthenticated';
import likeRouter from '../like';
import commentRouter from '../comment';

const router = Router();

router.use('/most-popular', aliasMostPopular, getAllPosts);

router.use('/:postId/like', likeRouter);
router.use('/:postId/comment', commentRouter);

router.get('/', getAllPosts);
router.get('/:postId', getPost);
router.patch('/:postId', restrictAuthenticated(), updatePost);
router.post('/', restrictAuthenticated(), addNewPost);
export default router;
