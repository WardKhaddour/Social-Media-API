import { Request, NextFunction } from 'express';
import { UserDocInterface } from '../interfaces/documents/UserDoc';
import Email from './Email';
import AppError from './AppError';
import { SERVER_ERROR } from '../constants';

const sendEmailConfirmationLink = async (
  user: UserDocInterface,
  req: Request,
  next: NextFunction
) => {
  const confirmToken = user.createEmailConfirmToken();
  await user.save({ validateBeforeSave: false });

  try {
    const email = new Email(user.email, confirmToken);
    await email.sendEmailConfirm();
  } catch (err) {
    user.emailConfirmToken = undefined;
    user.emailConfirmExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(req.i18n.t('msg.serverErrorOccurred'), SERVER_ERROR)
    );
  }
};

export default sendEmailConfirmationLink;
