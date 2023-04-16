import { NOT_FOUND, OK } from './../../constants';
import { Request, Response, NextFunction } from 'express';
import AppError from '../../utils/AppError';
import Follow from '../../models/Follow';

const checkFollowing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId: userToFollowId } = req.params;
  const currentUserId = req.user?._id;

  if (!userToFollowId) {
    return next(new AppError(req.i18n.t('userAuthMsg.noUser'), NOT_FOUND));
  }

  const isFollowing = (await Follow.findOne({
    follower: currentUserId,
    following: userToFollowId,
  }))
    ? true
    : false;

  res.status(OK).json({
    success: true,
    data: {
      isFollowing,
    },
  });
};
export default checkFollowing;
