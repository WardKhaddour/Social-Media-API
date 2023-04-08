import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import Post from '../models/Post';
import { OK } from '../constants';

export const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const posts = await Post.find();

    res.status(OK).json({
      success: true,
      message: 'Posts fetched successfully',
      data: posts,
    });
  }
);

export const addNewPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { content } = req.body;
    const userId = req.user?.id;
    const post = await Post.create({ author: userId, content });

    res.status(OK).json({
      success: true,
      message: 'Post added successfully',
      data: post,
    });
  }
);
