import { UserDocInterface } from '../interfaces/documents/UserDoc';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction, CookieOptions } from 'express';

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
  req: Request,
  res: Response
) => {
  const token = signToken(user._id);
  // const cookieExpiresIn = +process.env.JWT_COOKIE_EXPIRES_IN!;

  // const cookieOptions: CookieOptions = {
  //   expires: new Date(Date.now() + cookieExpiresIn * 24 * 60 * 60 * 1000),
  //   httpOnly: true,
  //   sameSite: 'none',
  //   domain: '',
  // };

  // if (process.env.NODE_ENV === 'production') {
  //   cookieOptions.secure = true;
  // }

  // res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    success: true,
    message,
    data: {
      user: {
        name: user.name,
        email: user.email,
        photo: user.photo,
        emailIsConfirmed: user.emailIsConfirmed,
      },
      token,
    },
  });
};

export default createAndSendToken;
