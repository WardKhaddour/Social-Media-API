import { Router } from 'express';
import { logout } from '../../controllers/userController';

const router = Router();

router.post('/logout', logout);

export default router;
