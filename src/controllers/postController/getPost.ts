import { NOT_FOUND, OK } from '../../constants';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import Post from '../../models/Post';
import AppError from '../../utils/AppError';

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

export default getPost;
