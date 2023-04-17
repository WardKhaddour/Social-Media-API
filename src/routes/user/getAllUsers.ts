import aliasMostPopularUsers from '../../controllers/userController/aliasMostPopularUsers';
import { getAllUsers } from './../../controllers/userController';
import { Router } from 'express';

const router = Router();

router.get('/', getAllUsers);
router.get('/most-popular', aliasMostPopularUsers, getAllUsers);

export default router;
