import { Router } from 'express';
import { getUserById } from '../../controllers/userController';
import checkAuthenticated from '../../middleware/checkAuthenticated';

const router = Router();

router.get('/:userId', checkAuthenticated(), getUserById);

export default router;
