import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, OK } from './../../constants';
import catchAsync from '../../utils/catchAsync';
import Post from '../../models/Post';
import AppError from '../../utils/AppError';

const getSavedPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user!;

    const posts = await Post.find({
      _id: { $in: user.savedPosts },
    });

    await user.save();

    res.status(OK).json({
      success: true,
      data: {
        posts,
      },
    });
  }
);

export default getSavedPosts;
