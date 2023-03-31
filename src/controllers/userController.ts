import express from 'express';
import User from '../models/User';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { DELETED, OK, UNAUTHORIZED } from '../constants';

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

    const userPhotoSrc = `${currentUrl}/images/${user.photo}`;
    res.status(OK).json({
      success: true,
      message: 'Welcome',
      data: {
        user: { name: user.name, email: user.email, photo: userPhotoSrc },
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
    message: 'Got user successfully',
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

    user.email = email || user.email;
    user.name = name || user.name;
    await user.save();
    res.status(OK).json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: { name, email },
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

    if (!(await user.isCorrectPassword(password, user.password))) {
      return next(
        new AppError('Incorrect password. Please try again', UNAUTHORIZED)
      );
    }
    user.active = false;
    await user.save();
    res.status(DELETED).json({
      success: false,
    });
  }
);
