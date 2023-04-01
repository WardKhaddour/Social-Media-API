import { Response, NextFunction } from 'express';
import { UserDocInterface } from '../../../interfaces/UserDoc';
import sendEmail from '../../../utils/email';
import AppError from '../../../utils/AppError';
import { SERVER_ERROR } from '../../../constants';

const sendEmailConfirmationLink = async (
  user: UserDocInterface,
  res: Response,
  next: NextFunction,
  title: string
) => {
  const confirmToken = user.createEmailConfirmToken();
  await user.save({ validateBeforeSave: false });

  const message = `${title}!!\n
    Please confirm your email to get access to this App!\n
    Your confirm email token is: ${confirmToken}\n
    It's only valid for 10 minutes
    `;

  try {
    await sendEmail({
      email: user.email,
      subject: title,
      message,
    });
    res.status(200).json({
      success: true,
      message: 'Please enter the token sent to your email address',
      data: {
        user: {
          name: user.name,
          email: user.email,
        },
      },
    });
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
