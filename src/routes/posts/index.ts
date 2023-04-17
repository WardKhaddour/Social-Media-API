import {
  getPost,
  getAllPosts,
  addNewPost,
  aliasMostPopular,
  updatePost,
  deletePost,
  getPostsByFollowing,
} from './../../controllers/postController';
import { Router } from 'express';

import restrictAuthenticated from '../../middleware/restrictAuthenticated';
import likeRouter from '../like';
import commentRouter from '../comment';
import aliasPostsByCategory from '../../controllers/postController/aliasPostsByCategory';

const router = Router();

router.get('/most-popular', aliasMostPopular, getAllPosts);
router.get('/category/:category', aliasPostsByCategory, getAllPosts);

router.get('/following', restrictAuthenticated(), getPostsByFollowing);

router.use('/:postId/like', likeRouter);
router.use('/:postId/comment', commentRouter);

router.route('/').get(getAllPosts).post(restrictAuthenticated(), addNewPost);

router
  .route('/:postId')
  .get(getPost)
  .patch(restrictAuthenticated(), updatePost)
  .delete(restrictAuthenticated(), deletePost);
export default router;
