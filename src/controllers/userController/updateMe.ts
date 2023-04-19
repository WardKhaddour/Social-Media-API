import { Request, Response, NextFunction } from 'express';

import catchAsync from '../../utils/catchAsync';
import Email from '../../utils/Email';
import AppError from '../../utils/AppError';
import { OK, SERVER_ERROR } from '../../constants';

export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name } = req.body;
    const user = req.user!;
    let photo = null;
    if (req.file) {
      photo = req.file.filename;
    }

    let resMessage = req.i18n.t('userAuthMsg.userUpdated');

    if (email && user.email !== email) {
      user.email = email;
      user.emailIsConfirmed = false;
      resMessage += req.i18n.t('userAuthMsg.confirmNewEmail');
      const confirmToken = user.createEmailConfirmToken();

      try {
        const email = new Email(user.email, confirmToken);
        await email.sendEmailConfirm();
      } catch (error) {
        user.emailConfirmToken = undefined;
        user.emailConfirmExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
          new AppError(
            req.i18n.t('userAuthMsg.serverErrorOccurred'),
            SERVER_ERROR
          )
        );
      }
    }

    user.name = name || user.name;
    user.photoSrc = photo || user.photoSrc;

    await user.save({ validateBeforeSave: false });
    res.status(OK).json({
      success: true,
      message: resMessage,
      data: {
        user: {
          name: user.name,
          email: user.email,
          photo: user.photo,
          emailIsConfirmed: user.emailIsConfirmed,
        },
      },
    });
  }
);
