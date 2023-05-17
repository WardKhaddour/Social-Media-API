import { Request, Response, NextFunction } from 'express';
import { NOT_FOUND, OK, SERVER_ERROR } from '../../constants';
import User from '../../models/User';
import AppError from '../../utils/AppError';
import catchAsync from '../../utils/catchAsync';
import sendEmailConfirmationLink from '../../utils/sendEmailConfirmationLink';

const resendConfirmToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new AppError(req.i18n.t('userAuthMsg.noUserEmail'), NOT_FOUND)
      );
    }
    try {
      
      await sendEmailConfirmationLink(user, req, next);
    } catch (err) {
      return next(new AppError(req.i18n.t('userAuthMsg.serverError'),SERVER_ERROR))
    }

    res.status(OK).json({
      success: true,
      message: req.i18n.t('userAuthMsg.tokenSent'),
    });
  }
);

export default resendConfirmToken;
