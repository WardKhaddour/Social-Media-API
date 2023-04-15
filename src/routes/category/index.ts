import {
  addNewCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from './../../controllers/categoryController/index';

import { Router } from 'express';
import restrictAuthenticated from '../../middleware/restrictAuthenticated';
import restrictTo from '../../middleware/restrictTo';
import { body } from 'express-validator';
import validateRequest from '../../middleware/validateRequest';

const router = Router();

router
  .route('/')
  .get(getAllCategories)
  .post(
    restrictAuthenticated(),
    restrictTo('admin'),
    body('name').isString().withMessage('Category name must be a string'),
    validateRequest,
    addNewCategory
  );

router
  .route('/:categoryId')
  .patch(
    restrictAuthenticated(),
    restrictTo('admin'),
    body('name').isString().withMessage('Category name must be a string'),
    validateRequest,
    updateCategory
  )
  .delete(restrictAuthenticated(), restrictTo('admin'), deleteCategory);

export default router;
