import { Request, Response, NextFunction } from 'express';
import { APIAggregateFeatures } from './../../utils/APIFeatures';
import { OK } from '../../constants';
import catchAsync from '../../utils/catchAsync';
import Post from '../../models/Post';
import User from '../../models/User';
import Category from '../../models/Category';
import { ObjectId } from 'mongodb';

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const savedPosts = req.user?.savedPosts;

    const aggregation = new APIAggregateFeatures(
      Post.aggregate(),
      req.query,
      Post
    )
      .removeFields(['attachment'])
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

    //Filter Posts by Following
    if (req.params.byFollowing === '1') {
      const following =
        req.params.following.split(',').map(el => new ObjectId(el)) || [];

      delete req.params.following;
      delete req.params.byFollowing;

      aggregation.aggregate.match({
        'author._id': { $in: following },
      });
    }

    aggregation.filter().filterByCategory().sort().limitFields();

    if (!req.query.category) {
      aggregation.populateFields({
        from: Category.collection.name,
        localField: 'category',
        foreignField: '_id',
        as: 'category',
        foreignFieldFields: {
          __v: 0,
        },
        asArray: true,
      });
    }
    aggregation.paginate();

    if (savedPosts)
      aggregation.addFields('isSaved', { $in: ['$_id', savedPosts] });

    const posts = await aggregation.aggregate.exec();

    res.status(OK).json({
      success: true,
      data: {
        posts,
        totalPages: aggregation.metaData.totalPages,
        page: aggregation.metaData.page,
      },
    });
  }
);

export default getAllPosts;
