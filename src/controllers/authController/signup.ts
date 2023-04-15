import { Request, Response, NextFunction } from 'express';

import catchAsync from '../../utils/catchAsync';
import User from '../../models/User';
import { ReqBody } from '../../interfaces/AuthReqBody';
import AppError from '../../utils/AppError';
import { BAD_REQUEST, OK } from '../../constants';
import sendEmailConfirmationLink from '../../utils/sendEmailConfirmationLink';
import createAndSendToken from '../../utils/createAndSendToken';

const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password }: ReqBody = req.body;
    const query = User.findOne({ email }).select('+active');
    query.setOptions({
      disableMiddleware: true,
    });
    let user = await query.exec();

    if (user && user.active) {
      return next(new AppError(req.i18n.t('msg.usedEmail'), BAD_REQUEST));
    }

    if (!user) {
      user = await User.create({ name, email, password });
    } else {
      user.name = name;
      user.active = true;

      await user.save();
    }

    await sendEmailConfirmationLink(user, req, next);

    createAndSendToken(
      user,
      OK,
      req.i18n.t('msg.createdAccountSuccess'),
      req,
      res
    );
  }
);

export default signup;
