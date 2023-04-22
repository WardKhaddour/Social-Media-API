import { NOT_FOUND, OK } from '../../constants';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import Post from '../../models/Post';
import AppError from '../../utils/AppError';
import Like from '../../models/Like';

export const getPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate('category').populate({
      path: 'author',
      select: 'name _id',
    });
    if (!post) {
      return next(new AppError(req.i18n.t('postMsg.noPost'), NOT_FOUND));
    }

    let isLiked = false;
    let isSaved = false;
    const user = req.user;
    if (user) {
      isLiked = !!(await Like.findOne({
        user: user?.id,
        post: postId,
      }));
      isSaved = !!user.savedPosts.includes(post._id);
    }

    res.status(OK).json({
      success: true,
      data: {
        post: { ...post.toJSON(), isLiked, isSaved },
      },
    });
  }
);

export default getPost;
