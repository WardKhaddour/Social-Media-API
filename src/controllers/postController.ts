import { NOT_FOUND, OK, BAD_REQUEST } from './../constants';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import Post from '../models/Post';
import AppError from '../utils/AppError';
import APIFeatures from '../utils/APIFeatures';

export const aliasMostPopular = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    req.query.limit = '10';
    req.query.sort = '-likesNum,-commentsNum';
    next();
  }
);

export const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Post.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const posts = await features.query;
    res.status(OK).json({
      success: true,
      message: 'Posts fetched successfully',
      data: posts,
    });
  }
);

export const getPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate('comments');
    if (!post) {
      return next(new AppError('No post found', NOT_FOUND));
    }

    res.status(OK).json({
      success: true,
      data: post,
    });
  }
);

export const addNewPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, content } = req.body;
    const userId = req.user?.id;
    const post = await Post.create({
      author: userId,
      title,
      content,
    });

    res.status(OK).json({
      success: true,
      message: 'Post added successfully',
      data: post,
    });
  }
);
