import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import Follow from '../../models/Follow';

const aliasPostsByFollowing = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user!;
    const following = (
      await Follow.find({
        follower: user._id,
      }).select('following')
    )
      .map(follow => follow.following.toString())
      .join(',');
    req.params.following = following;
    req.params.byFollowing = '1';
    next();
  }
);

export default aliasPostsByFollowing;
