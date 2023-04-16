import { OK } from '../../constants';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import Post from '../../models/Post';
import APIFeatures from '../../utils/APIFeatures';

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Post.find(), req.query)
      .filterByCategory()
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const posts = await features.query;
    res.status(OK).json({
      success: true,
      data: posts,
    });
  }
);

export default getAllPosts;
