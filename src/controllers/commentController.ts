import { DELETED, FORBIDDEN, NOT_FOUND, OK } from './../constants';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import Comment from '../models/Comment';
import Post from '../models/Post';
import AppError from '../utils/AppError';

export const addNewComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { content } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new AppError('No Post Fount', NOT_FOUND));
    }
    const user = req.user;
    await Comment.create({
      post: postId,
      user: user?.id,
      content,
    });
    post.commentsNum++;
    await post?.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  }
);

export const getCommentsOnPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new AppError('No Post Fount', NOT_FOUND));
    }

    const comments = await Comment.find({
      post: post.id,
    }).populate({
      path: 'user',
      select: 'name photo',
    });

    res.status(200).json({
      success: true,
      data: comments,
    });
  }
);

export const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, content } = req.body;
    const { commentId } = req.params;
    const { user } = req;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(new AppError('No comment found', NOT_FOUND));
    }

    if (user?.role !== 'admin' && !comment.user.equals(user?.id)) {
      return next(
        new AppError(
          'You do not have permission to update this comment',
          FORBIDDEN
        )
      );
    }
    comment.content = content || comment.content;
    await comment.save();
    res.status(OK).json({
      success: true,
      message: 'Comment updated successfully',
      data: comment,
    });
  }
);

export const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const { user } = req;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(new AppError('No comment found', NOT_FOUND));
    }

    if (user?.role !== 'admin' && !comment.user.equals(user?.id)) {
      return next(
        new AppError(
          'You do not have permission to update this comment',
          FORBIDDEN
        )
      );
    }
    await comment.deleteOne();
    res.status(DELETED).json({
      success: true,
      message: 'Comment updated successfully',
    });
  }
);
