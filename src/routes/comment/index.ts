import { getCommentsOnPost } from './../../controllers/commentController';
import { Router } from 'express';
import restrictAuthenticated from '../../middleware/restrictAuthenticated';
import { addNewComment } from '../../controllers/commentController';

const router = Router({ mergeParams: true });

router.post('/', restrictAuthenticated(), addNewComment);
router.get('/', getCommentsOnPost);
export default router;
