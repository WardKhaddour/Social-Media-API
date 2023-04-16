import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import Category from '../../models/Category';

const aliasPostsByCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findOne({ name: req.params.category });
    if (!category) {
      return next();
    }
    req.query.category = category.id;
    next();
  }
);

export default aliasPostsByCategory;
