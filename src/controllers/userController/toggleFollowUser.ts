import { NOT_FOUND, BAD_REQUEST, SERVER_ERROR } from './../../constants';
import { Request, Response, NextFunction, query } from 'express';

import User from '../../models/User';
import Follow from '../../models/Follow';
import { OK } from '../../constants';
import AppError from '../../utils/AppError';
import { ObjectId } from 'mongodb';

const toggleFollowUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;
  const { userId: userToFollowId } = req.params;
  if (!ObjectId.isValid(userToFollowId)) {
    return next(
      new AppError(req.i18n.t('userAuthMsg.serverError'), SERVER_ERROR)
    );
  }
  if (user._id.equals(userToFollowId)) {
    return next(
      new AppError(req.i18n.t('followMsg.noFollowYourself'), BAD_REQUEST)
    );
  }
  User.findById(userToFollowId);

  const [isFollowing, userToFollow] = await Promise.all([
    Follow.findOne({
      follower: user._id,
      following: userToFollowId,
    }),
    User.findById(userToFollowId),
  ]);

  if (!userToFollow) {
    return next(new AppError(req.i18n.t('userAuthMsg.noUser'), NOT_FOUND));
  }

  if (isFollowing) {
    user.followingNum--;
    userToFollow.followersNum--;
    const [, updatedUser, updatedUserToFollow] = await Promise.all([
      isFollowing.deleteOne(),
      user.save(),
      userToFollow.save(),
    ]);
    return res.status(OK).json({
      success: true,
      message: req.i18n.t('followMsg.unfollowedUserSuccess', {
        name: userToFollow.name,
      }),
      data: {
        userToFollow: {
          followers: userToFollow.followersNum,
        },
        user: {
          following: user.followingNum,
        },
      },
    });
  }

  user.followingNum++;
  userToFollow.followersNum++;
  const [, updatedUser, updatedUserToFollow] = await Promise.all([
    Follow.create({ follower: user._id, following: userToFollowId }),
    user.save(),
    userToFollow.save(),
  ]);
  return res.status(OK).json({
    success: true,
    message: req.i18n.t('followMsg.followedUserSuccess', {
      name: userToFollow.name,
    }),
    data: {
      userToFollow: {
        followers: userToFollow.followersNum,
      },
      user: {
        following: user.followingNum,
      },
    },
  });
};
export default toggleFollowUser;
