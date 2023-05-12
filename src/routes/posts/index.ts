import {
  getPost,
  getAllPosts,
  addNewPost,
  aliasMostPopular,
  updatePost,
  deletePost,
  aliasPostsByFollowing,
  getSavedPosts,
  toggleSavePost,
  deletePostAttachment,
} from './../../controllers/postController';
import { Router } from 'express';

import restrictAuthenticated from '../../middleware/restrictAuthenticated';
import likeRouter from '../like';
import commentRouter from '../comment';
import aliasPostsByCategory from '../../controllers/postController/aliasPostsByCategory';
import checkAuthenticated from '../../middleware/checkAuthenticated';
import attachPostFiles from '../../middleware/attachPostFiles';
import formatAttachments from '../../middleware/formatAttachments';

const router = Router();

router.get(
  '/most-popular',
  aliasMostPopular,
  checkAuthenticated(),
  getAllPosts
);
router.get(
  '/category/:category',
  aliasPostsByCategory,
  checkAuthenticated(),
  getAllPosts
);

router.get(
  '/following',
  restrictAuthenticated(),
  aliasPostsByFollowing,
  getAllPosts
);

router.use('/:postId/like', likeRouter);
router.use('/:postId/comment', commentRouter);

router
  .route('/')
  .get(checkAuthenticated(), getAllPosts)
  .post(
    restrictAuthenticated(),
    attachPostFiles,
    formatAttachments,
    addNewPost
  );

router.get('/saved', restrictAuthenticated(), getSavedPosts);
router.post('/saved/:postId', restrictAuthenticated(), toggleSavePost);

router
  .route('/:postId')
  .get(checkAuthenticated(), getPost)
  .patch(
    restrictAuthenticated(),
    attachPostFiles,
    formatAttachments,
    updatePost
  )
  .delete(restrictAuthenticated(), deletePost);

//  `post/${postId}/attachment/${attachmentName}`;
router.delete(
  '/:postId/attachment/:attachmentName',
  restrictAuthenticated(),
  deletePostAttachment
);
export default router;
