import { OK } from '../../constants';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import User from '../../models/User';
import { APIQueryFeatures } from '../../utils/APIFeatures';

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = await new APIQueryFeatures(
      User.find().setOptions({
        notAuthData: true,
      }),
      req.query,
      User
    )
      .filterByCategory()
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const users = await features.query;
    res.status(OK).json({
      success: true,
      data: {
        users,
        totalPages: features.metaData.totalPages,
        page: features.metaData.page,
      },
    });
  }
);

export default getAllUsers;
