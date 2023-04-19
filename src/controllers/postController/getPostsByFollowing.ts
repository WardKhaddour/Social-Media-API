import { OK } from '../../constants';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import Post from '../../models/Post';
import Follow from '../../models/Follow';
import { APIQueryFeatures } from '../../utils/APIFeatures';

const getPostsByFollowing = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user!;
    const following = (
      await Follow.find({
        follower: user._id,
      }).select('following')
    ).map(follow => follow.following);

    const features = new APIQueryFeatures(
      Post.find({
        author: { $in: [following] },
      }),
      req.query
    )
      .filterByCategory()
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const posts = await features.query;

    res.status(OK).json({
      success: true,
      data: { posts },
    });
  }
);

export default getPostsByFollowing;
