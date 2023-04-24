import { APIAggregateFeatures } from './../../utils/APIFeatures';
import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, OK } from './../../constants';
import catchAsync from '../../utils/catchAsync';
import Post from '../../models/Post';
import AppError from '../../utils/AppError';
import Category from '../../models/Category';

const getSavedPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user!;

    const aggregation = new APIAggregateFeatures(Post.aggregate())
      .filterByMatches({
        filedName: '_id',
        arrayMatches: user.savedPosts,
      })
      .sort()
      .populateFields({
        from: Category.collection.name,
        localField: 'category',
        foreignField: '_id',
        as: 'category',
        foreignFieldFields: {
          __v: 0,
        },
        asArray: true,
      })
      .addFields('isSaved', true);

    const posts = await aggregation.aggregate.exec();

    res.status(OK).json({
      success: true,
      data: {
        posts,
      },
    });
  }
);

export default getSavedPosts;
