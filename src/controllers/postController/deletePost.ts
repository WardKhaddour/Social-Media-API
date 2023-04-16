import { NOT_FOUND, FORBIDDEN, DELETED } from '../../constants';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import Post from '../../models/Post';
import AppError from '../../utils/AppError';
const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { user } = req;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new AppError('No post found', NOT_FOUND));
    }

    if (user?.role !== 'admin' && !post.author.equals(user?.id)) {
      return next(
        new AppError(
          'You do not have permission to update this post',
          FORBIDDEN
        )
      );
    }
    await post.deleteOne();
    res.status(DELETED).json({
      success: true,
      message: 'Post updated successfully',
    });
  }
);

export default deletePost;
