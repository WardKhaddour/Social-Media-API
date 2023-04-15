import express from 'express';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/AppError';
import { DELETED, UNAUTHORIZED } from '../../constants';

const deleteMe = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { password } = req.body;
    const user = req.user!;

    if (!(await user.isCorrectPassword(password, user.password))) {
      return next(
        new AppError(req.i18n.t('msg.incorrectPassword'), UNAUTHORIZED)
      );
    }
    user.active = false;
    user.emailIsConfirmed = false;
    user.name = 'Deleted Account';
    user.photo = undefined;
    await user.save();
    res.status(DELETED).json({
      success: false,
    });
  }
);
export default deleteMe;
