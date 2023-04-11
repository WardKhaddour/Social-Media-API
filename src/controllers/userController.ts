import express from 'express';
import User from '../models/User';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { DELETED, OK, SERVER_ERROR, UNAUTHORIZED } from '../constants';
import Email from '../utils/Email';

export const checkAuthenticated = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const user = req.user!;

    const currentUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.PROD_URL
        : process.env.DEV_URL;

    const userPhotoSrc = `${currentUrl}/images/users/${user.photo}`;
    res.status(OK).json({
      success: true,
      message: req.i18n.t('msg.welcome'),
      data: {
        user: {
          name: user.name,
          email: user.email,
          photo: userPhotoSrc,
          emailIsConfirmed: user.emailIsConfirmed,
        },
      },
    });
  }
);

export const getUserData = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    message: req.i18n.t('msg.gotUserSuccess'),
    data: {
      users,
      user: {
        email: req.user?.email,
        name: req.user?.name,
      },
    },
  });
};

export const updateMe = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { email, name } = req.body;
    const user = req.user!;
    let photo = null;
    if (req.file) {
      photo = req.file.filename;
    }

    let resMessage = req.i18n.t('msg.userUpdated');

    if (email && user.email !== email) {
      user.email = email;
      user.emailIsConfirmed = false;
      resMessage += req.i18n.t('msg.confirmNewEmail');
      const confirmToken = user.createEmailConfirmToken();

      try {
        const email = new Email(user.email, confirmToken);
        await email.sendEmailConfirm();
      } catch (error) {
        user.emailConfirmToken = undefined;
        user.emailConfirmExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
          new AppError(req.i18n.t('msg.serverErrorOccurred'), SERVER_ERROR)
        );
      }
    }

    user.name = name || user.name;
    user.photo = photo || user.photo;
    const currentUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.PROD_URL
        : process.env.DEV_URL;

    const userPhotoSrc = `${currentUrl}/images/users/${user.photo}`;
    await user.save({ validateBeforeSave: false });
    res.status(OK).json({
      success: true,
      message: resMessage,
      data: {
        user: {
          name: user.name,
          email: user.email,
          photo: userPhotoSrc,
          emailIsConfirmed: user.emailIsConfirmed,
        },
      },
    });
  }
);

export const deleteMe = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { password } = req.body;
    const user = req.user!;
    console.log(password);

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
