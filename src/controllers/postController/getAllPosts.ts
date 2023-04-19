import { Request, Response, NextFunction } from 'express';
import {
  APIAggregateFeatures,
  APIQueryFeatures,
} from './../../utils/APIFeatures';
import { OK } from '../../constants';
import catchAsync from '../../utils/catchAsync';
import Post from '../../models/Post';
import User from '../../models/User';

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const aggregation = new APIAggregateFeatures(Post.aggregate(), req.query)
      .filter()
      .filterByCategory()
      .sort()
      .limitFields()
      .paginate()
      .populateFields({
        from: User.collection.name,
        localField: 'author',
        foreignField: '_id',
        as: 'author',
        foreignFieldFields: {
          name: 1,
          _id: 1,
        },
      });

    const posts = await aggregation.aggregate.exec();

    res.status(OK).json({
      success: true,
      data: {
        posts,
      },
    });
  }
);

export default getAllPosts;
