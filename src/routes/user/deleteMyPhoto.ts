import { deleteMyPhoto } from '../../controllers/userController';
import restrictAuthenticated from '../../middleware/restrictAuthenticated';
import { Router } from 'express';

const router = Router();

router.delete('/photo', restrictAuthenticated(), deleteMyPhoto);

export default router;
