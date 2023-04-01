import { Request, Response, NextFunction } from 'express';

import catchAsync from '../../../utils/catchAsync';
import User from '../../../models/User';
import { ReqBody } from '../helpers/ReqBody';
import AppError from '../../../utils/AppError';
import { BAD_REQUEST } from '../../../constants';
import sendEmailConfirmationLink from '../helpers/sendEmailConfirmationLink';

const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password }: ReqBody = req.body;
    const foundUser = await User.findOne({ email });

    if (foundUser) {
      return next(new AppError('E-Mail already in use', BAD_REQUEST));
    }

    const user = await User.create({ name, email, password });
    await sendEmailConfirmationLink(user, res, next, 'Welcome');
  }
);

export default signup;
