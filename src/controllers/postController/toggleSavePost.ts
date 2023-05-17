import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, OK, SERVER_ERROR } from '../../constants';
import catchAsync from '../../utils/catchAsync';
import Post from '../../models/Post';
import AppError from '../../utils/AppError';
import { io } from '../..';
import { ioActions, ioEvents } from '../../socketIo';
import { ObjectId } from 'mongodb';

const toggleSavePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user!;
    const { postId } = req.params;
    if (!ObjectId.isValid(postId)) {
      return next(
        new AppError(req.i18n.t('userAuthMsg.serverError'), SERVER_ERROR)
      );
    }
    const post = await Post.findById(postId);
    if (!post) {
      return next(new AppError(req.i18n.t('postMsg.noPost'), BAD_REQUEST));
    }

    const savedPostIndex = user.savedPosts.indexOf(post._id);

    if (savedPostIndex !== -1) {
      user.savedPosts.splice(savedPostIndex, 1);
    } else {
      user.savedPosts.push(post._id);
    }

    await user.save();
    if (req.socketId) {
      io.to(req.socketId).emit(ioEvents.SAVE_POST, {
        action: ioActions.UPDATE,
        data: {
          post: post._id,
          isSaved: user.savedPosts.includes(post._id),
        },
      });
    }

    res.status(OK).json({
      success: true,
      data: {
        user,
      },
    });
  }
);

export default toggleSavePost;
