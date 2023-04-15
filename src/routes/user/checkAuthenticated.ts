import { Router } from 'express';
import { checkAuthenticated } from './../../controllers/userController';

import restrictAuthenticated from '../../middleware/restrictAuthenticated';

const router = Router();

router.get('/', restrictAuthenticated(), checkAuthenticated);

export default router;
