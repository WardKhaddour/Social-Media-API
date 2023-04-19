import { OK } from '../../constants';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import User from '../../models/User';
import { APIQueryFeatures } from '../../utils/APIFeatures';

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIQueryFeatures(User.find(), req.query)
      .filterByCategory()
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const users = await features.query;
    res.status(OK).json({
      success: true,
      data: { users },
    });
  }
);

export default getAllUsers;
