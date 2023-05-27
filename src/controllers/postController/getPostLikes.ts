import { NOT_FOUND, OK, SERVER_ERROR } from '../../constants';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import Post from '../../models/Post';
import AppError from '../../utils/AppError';
import Like from '../../models/Like';
import { ObjectId } from 'mongodb';

export const getPostLikes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    if (!ObjectId.isValid(postId)) {
      return next(
        new AppError(req.i18n.t('userAuthMsg.serverError'), SERVER_ERROR)
      );
    }

    const likes = await Like.find({
      post: postId,
    }).populate('user', 'name photoSrc photo _id');

    res.status(200).json({
      success: true,
      data: {
        likes,
      },
    });
  }
);

export default getPostLikes;
