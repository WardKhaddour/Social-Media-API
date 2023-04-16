import {
  deleteComment,
  getCommentsOnPost,
  updateComment,
} from './../../controllers/commentController';
import { Router } from 'express';
import restrictAuthenticated from '../../middleware/restrictAuthenticated';
import { addNewComment } from '../../controllers/commentController';

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(getCommentsOnPost)
  .post(restrictAuthenticated(), addNewComment);

router
  .route('/:commentId')
  .patch(restrictAuthenticated(), updateComment)
  .delete(restrictAuthenticated(), deleteComment);

export default router;
