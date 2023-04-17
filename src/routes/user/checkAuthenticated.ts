import { Router } from 'express';
import { checkAuthenticated } from './../../controllers/userController';

import restrictAuthenticated from '../../middleware/restrictAuthenticated';

const router = Router();

router.get('/is-auth', restrictAuthenticated(), checkAuthenticated);

export default router;
