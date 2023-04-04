import { NextFunction } from 'express';
import { UserDocInterface } from '../../../interfaces/UserDoc';
import Email from '../../../utils/Email';
import AppError from '../../../utils/AppError';
import { SERVER_ERROR } from '../../../constants';

const sendEmailConfirmationLink = async (
  user: UserDocInterface,
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
      new AppError('An Error occurred. Please try again later', SERVER_ERROR)
    );
  }
};

export default sendEmailConfirmationLink;
