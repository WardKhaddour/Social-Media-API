import { Request, Response, NextFunction } from 'express';
import {
  APIAggregateFeatures,
  APIQueryFeatures,
} from './../../utils/APIFeatures';
import { OK } from '../../constants';
import catchAsync from '../../utils/catchAsync';
import Post from '../../models/Post';

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const aggregation = new APIAggregateFeatures(Post.aggregate(), req.query)
      .filter()
      .filterByCategory()
      .sort()
      .limitFields()
      .paginate();

    const posts = await aggregation.aggregate.explain();

    res.status(OK).json({
      success: true,
      data: {
        posts,
      },
    });
  }
);

export default getAllPosts;
