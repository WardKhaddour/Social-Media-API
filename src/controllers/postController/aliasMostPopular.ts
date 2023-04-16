import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';

const aliasMostPopular = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    req.query.limit = '10';
    req.query.sort = '-likesNum,-commentsNum';
    next();
  }
);

export default aliasMostPopular;
