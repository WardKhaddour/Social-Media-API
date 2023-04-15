import { Router } from 'express';
import { getUserById } from '../../controllers/userController';

const router = Router();

router.get('/:userId', getUserById);

export default router;
