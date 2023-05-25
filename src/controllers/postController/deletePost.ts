import { NOT_FOUND, FORBIDDEN, DELETED, SERVER_ERROR } from '../../constants';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import Post from '../../models/Post';
import Like from '../../models/Like';
import Comment from '../../models/Comment';
import AppError from '../../utils/AppError';
import fs from 'fs/promises';
import { io } from '../..';
import { ioActions, ioEvents } from '../../socketIo';
import { ObjectId } from 'mongodb';
import { deleteFile } from '../../utils/file';

const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { user } = req;
    if (!ObjectId.isValid(postId)) {
      return next(
        new AppError(req.i18n.t('userAuthMsg.serverError'), SERVER_ERROR)
      );
    }
    const post = await Post.findById(postId);
    if (!post) {
      return next(new AppError(req.i18n.t('postMsg.noPost'), NOT_FOUND));
    }

    if (user?.role !== 'admin' && !post.author.equals(user?.id)) {
      return next(
        new AppError(req.i18n.t('userAuthMsg.noPermissions'), FORBIDDEN)
      );
    }
    const promises = [];

    const postLikes = await Like.find({
      post: post._id,
    });
    const postComments = await Comment.find({
      post: post._id,
    });
    post.attachment?.forEach(attach => {
      promises.push(deleteFile(`public/${attach.filePath}`));
    });
    postLikes.forEach(like => promises.push(like.deleteOne()));
    postComments.forEach(comment => promises.push(comment.deleteOne()));

    promises.push(post.deleteOne());

    await Promise.all(promises);

    io.emit(ioEvents.POST, {
      action: ioActions.DELETE,
      post: post._id,
    });
    res.status(DELETED).json({
      success: true,
      message: req.i18n.t('postMsg.postDeleted'),
    });
  }
);

export default deletePost;
