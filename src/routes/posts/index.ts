import {
  getPost,
  getAllPosts,
  addNewPost,
  aliasMostPopular,
  updatePost,
  deletePost,
} from './../../controllers/postController';
import { Router } from 'express';

import restrictAuthenticated from '../../middleware/restrictAuthenticated';
import likeRouter from '../like';
import commentRouter from '../comment';
import aliasPostsByCategory from '../../controllers/postController/aliasPostsByCategory';

const router = Router();

router.use('/most-popular', aliasMostPopular, getAllPosts);
router.use('/category/:category', aliasPostsByCategory, getAllPosts);

router.use('/:postId/like', likeRouter);
router.use('/:postId/comment', commentRouter);

router.route('/').get(getAllPosts).post(restrictAuthenticated(), addNewPost);

router
  .route('/:postId')
  .get(getPost)
  .patch(restrictAuthenticated(), updatePost)
  .delete(restrictAuthenticated(), deletePost);
export default router;
