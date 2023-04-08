import { Router } from 'express';
import { addNewPost, getAllPosts } from '../../controllers/postsController';
import restrictAuthenticated from '../../middleware/restrictAuthenticated';

const router = Router();

router.get('/', getAllPosts);
router.post('/', restrictAuthenticated(), addNewPost);
export default router;
