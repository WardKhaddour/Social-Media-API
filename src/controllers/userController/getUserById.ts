import { NOT_FOUND, OK } from './../../constants';
import { Request, Response, NextFunction } from 'express';

import User from '../../models/User';
import AppError from '../../utils/AppError';
import Follow from '../../models/Follow';

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const currentUser = req.user;
  const query = User.findById(userId).populate({
    path: 'posts',
    populate: {
      path: 'category',
    },
  });

  if (userId === currentUser?.id) {
    query.select('-email -savedPosts');
  } else {
    query.select('-email -savedPosts -following');
  }

  query.setOptions({
    notAuthData: true,
  });

  const user = await query;

  if (!user) {
    return next(new AppError(req.i18n.t('userAuthMsg.noUser'), NOT_FOUND));
  }

  const isFollowing = !!(await Follow.findOne({
    follower: currentUser?._id,
    following: user._id,
  }));

  res.status(OK).json({
    success: true,
    message: req.i18n.t('userAuthMsg.gotUserSuccess'),
    data: {
      user: { ...user.toJSON(), isFollowing },
    },
  });
};
export default getUserById;
