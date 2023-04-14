import { NOT_FOUND } from './../constants';
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
