import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import {
  CREATED,
  UNAUTHORIZED,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  OK,
} from '../constants';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import sendEmail from '../utils/email';
import { UserDocInterface } from '../interfaces/UserDoc';

interface ReqBody {
  email: string;
  password: string;
  name?: string | undefined;
}

const signToken = (userId: string): string => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });
  return token;
};

const createAndSendToken = (
  user: UserDocInterface,
  statusCode: number,
  message: string,
  req: express.Request,
  res: express.Response
) => {
  const token = signToken(user._id);
  const cookieExpiresIn = +process.env.JWT_COOKIE_EXPIRES_IN!;

  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpiresIn * 24 * 60 * 60 * 1000),
    secure: false,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  const currentUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.PROD_URL
      : process.env.DEV_URL;

  const userPhotoSrc = `${currentUrl}/images/${user.photo}`;

  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    success: true,
    message,
    data: { user: { name: user.name, email: user.email, photo: userPhotoSrc } },
  });
};

const sendEmailConfirmationLink = async (
  user: UserDocInterface,
  res: express.Response,
  next: express.NextFunction,
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
        name: user.name,
        email: user.email,
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

export const signup = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { name, email, password }: ReqBody = req.body;
    const foundUser = await User.findOne({ email });

    if (foundUser) {
      return next(new AppError('E-Mail already in use', BAD_REQUEST));
    }

    const user = await User.create({ name, email, password });
    await sendEmailConfirmationLink(user, res, next, 'Welcome');
  }
);

export const resendConfirmToken = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new AppError('No user found with this email address', NOT_FOUND)
      );
    }
    await sendEmailConfirmationLink(
      user,
      res,
      next,
      'Your confirm email token'
    );
  }
);

export const confirmEmail = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailConfirmToken: hashedToken,
      emailConfirmExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Token is invalid or has expired', BAD_REQUEST));
    }

    user.emailIsConfirmed = true;
    user.emailConfirmToken = undefined;
    user.emailConfirmExpires = undefined;

    await user.save();
    createAndSendToken(user, OK, 'Welcome !!', req, res);
  }
);
export const login = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { email, password }: ReqBody = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new AppError('Invalid credentials', UNAUTHORIZED));
    }

    if (user.cannotTryLogin()) {
      const remainingTime = (
        (user.loginAttemptsAt.getTime() - Date.now()) /
        (1000 * 60)
      ).toFixed(2);
      return next(
        new AppError(
          `Please wait ${remainingTime} minutes then retry`,
          UNAUTHORIZED
        )
      );
    }

    const isCorrectPassword = await user.isCorrectPassword(
      password,
      user.password
    );

    if (!isCorrectPassword) {
      await user.handleLoginAttemptFail();
      return next(
        new AppError(
          `Invalid credentials, You have only ${user.totalLoginAttempts} remaining login attempts`,
          UNAUTHORIZED
        )
      );
    }

    await user.resetTotalAttempts();

    createAndSendToken(user, OK, 'Logged In', req, res);
  }
);

export const forgotPassword = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(
        new AppError('There is no user with this email address', NOT_FOUND)
      );
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const message = `Forgot your password?\n
    Your Reset Token is ${resetToken} \n
    It's only valid for 10 minutes!!.\n
    If you didn't forgot your password, please ignore this email`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid only for 10 minutes)',
        message,
      });
      res.status(200).json({
        success: true,
        message: 'Token sent to your email',
      });
    } catch (err) {
      console.log(err);

      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError('An Error occurred. Please try again later', SERVER_ERROR)
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Token is invalid or has expired', BAD_REQUEST));
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    createAndSendToken(user, OK, 'Changed password successfully', req, res);
  }
);

export const updatePassword = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { currentPassword, password } = req.body;

    const user = await User.findById(req.user?._id).select('+password');

    if (
      !user ||
      !(await user.isCorrectPassword(currentPassword, user.password))
    ) {
      return next(new AppError('Your current password is wrong', UNAUTHORIZED));
    }

    user.password = password;
    await user.save();

    createAndSendToken(user, OK, 'Password changed successfully', req, res);
  }
);

export const logout = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.cookie('jwt', null);
  res.status(OK).json({
    success: true,
    message: 'Logged out successfully',
    data: null,
  });
};
