import { UserDocInterface } from '../interfaces/documents/UserDoc';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

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

  res.status(statusCode).json({
    success: true,
    message,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        bio: user.bio,
        emailIsConfirmed: user.emailIsConfirmed,
      },
      token,
    },
  });
};

export default createAndSendToken;
