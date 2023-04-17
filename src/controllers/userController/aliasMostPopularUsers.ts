import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';

const aliasMostPopularUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    req.query.limit = '20';
    req.query.sort = '-followersNum';
    next();
  }
);

export default aliasMostPopularUsers;
