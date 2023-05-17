import { NOT_FOUND, SERVER_ERROR } from './../constants';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import Like from '../models/Like';
import Post from '../models/Post';
import AppError from '../utils/AppError';
import { io } from '..';
import { ioActions, ioEvents } from '../socketIo';
import { ObjectId } from 'mongodb';

export const toggleLike = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    if (!ObjectId.isValid(postId)) {
      return next(
        new AppError(req.i18n.t('userAuthMsg.serverError'), SERVER_ERROR)
      );
    }
    const post = await Post.findById(postId);
    if (!post) {
      return next(new AppError('', NOT_FOUND));
    }
    const user = req.user;
    const prevLike = await Like.findOne({
      user: user?.id,
      post: postId,
    });

    if (prevLike) {
      await Like.deleteOne({
        _id: prevLike.id,
      });
      post.likesNum--;
    } else {
      await Like.create({
        post: postId,
        user: user?.id,
      });
      post.likesNum++;
    }
    await post?.save({ validateBeforeSave: false });

    if (req.socketId) {
      io.to(req.socketId).emit(ioEvents.LIKE, {
        action: ioActions.UPDATE,
        data: { post: post._id, isLiked: !prevLike, likesNum: post.likesNum },
      });
    }
    io.emit(ioEvents.LIKE, {
      action: ioActions.UPDATE,
      data: {
        post: post._id,
        likesNum: post.likesNum,
      },
    });

    res.status(200).json({
      success: true,
    });
  }
);
