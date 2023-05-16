import { ObjectId } from 'mongodb';
import { DELETED, FORBIDDEN, NOT_FOUND, OK, SERVER_ERROR } from './../constants';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import Comment from '../models/Comment';
import Post from '../models/Post';
import AppError from '../utils/AppError';
import { io } from '../server';
import { ioActions, ioEvents } from '../socketIo';

export const addNewComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { content } = req.body;
    if (!ObjectId.isValid(postId)) {
      return next(new AppError(req.i18n.t('userAuthMsg.serverError'),SERVER_ERROR))
    }
    const post = await Post.findById(postId);
    if (!post) {
      return next(new AppError(req.i18n.t('postMsg.noPost'), NOT_FOUND));
    }
    const user = req.user;
    const comment = await Comment.create({
      post: postId,
      user: user?.id,
      content,
    });
    post.commentsNum++;

    await post?.save({ validateBeforeSave: false });
    io.emit(ioEvents.COMMENT, {
      action: ioActions.CREATE,
      data: {
        comment: {
          ...comment.toObject(),
          user: {
            name: req.user?.name,
            _id: req.user?._id,
            photo: req.user?.photo,
          },
        },
        post: post._id,
        commentsNum: post.commentsNum,
      },
    });

    res.status(200).json({
      success: true,
    });
  }
);

export const getCommentsOnPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params; if (!ObjectId.isValid(postId)) {
      return next(
        new AppError(req.i18n.t('userAuthMsg.serverError'), SERVER_ERROR)
      );
    }
    const post = await Post.findById(postId);
    if (!post) {
      return next(new AppError(req.i18n.t('postMsg.noPost'), NOT_FOUND));
    }

    const comments = await Comment.find({
      post: post.id,
    }).populate({
      path: 'user',
      select: 'name photoSrc photo',
    });

    res.status(200).json({
      success: true,
      data: { comments },
    });
  }
);

export const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { content } = req.body;
    const { commentId } = req.params;
    const { user } = req; if (!ObjectId.isValid(commentId)) {
      return next(
        new AppError(req.i18n.t('userAuthMsg.serverError'), SERVER_ERROR)
      );
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(new AppError(req.i18n.t('commentMsg.noComment'), NOT_FOUND));
    }

    if (!comment.user.equals(user?.id)) {
      return next(
        new AppError(req.i18n.t('userAuthMsg.noPermissions'), FORBIDDEN)
      );
    }
    comment.content = content || comment.content;
    await comment.save();
    io.emit(ioEvents.COMMENT, {
      action: ioActions.UPDATE,
      data: {
        post: comment.post,
        comment: {
          ...comment.toObject(),
          user: {
            name: req.user?.name,
            _id: req.user?._id,
            photo: req.user?.photo,
          },
        },
      },
    });
    res.status(OK).json({
      success: true,
      message: req.i18n.t('commentMsg.commentUpdated'),
      data: { comment },
    });
  }
);

export const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, commentId } = req.params;
    const { user } = req;

     if (!ObjectId.isValid(commentId) || !ObjectId.isValid(postId)) {
       return next(
         new AppError(req.i18n.t('userAuthMsg.serverError'), SERVER_ERROR)
       );
     }
 if (!ObjectId.isValid(commentId) || !ObjectId.isValid(postId)) {
   return next(
     new AppError(req.i18n.t('userAuthMsg.serverError'), SERVER_ERROR)
   );
 }
    const [post, comment] = await Promise.all([
      Post.findById(postId),
      Comment.findById(commentId),
    ]);
    if (!comment) {
      return next(new AppError(req.i18n.t('commentMsg.noComment'), NOT_FOUND));
    }
    if (!post) {
      return next(new AppError(req.i18n.t('postMsg.noPost'), NOT_FOUND));
    }

    if (!comment.user.equals(user?.id)) {
      return next(
        new AppError(req.i18n.t('userAuthMsg.noPermissions'), FORBIDDEN)
      );
    }
    post.commentsNum = post.commentsNum - 1;
    await Promise.all([comment.deleteOne(), post.save()]);
    io.emit(ioEvents.COMMENT, {
      action: ioActions.DELETE,
      data: {
        comment: comment._id,
        post: comment.post._id,
        commentsNum: post.commentsNum,
      },
    });
    res.status(DELETED).json({
      success: true,
    });
  }
);
