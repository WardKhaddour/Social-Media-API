import { NOT_FOUND, OK, FORBIDDEN } from './../../constants';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/AppError';
import Post from '../../models/Post';

const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, content } = req.body;
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
    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();
    res.status(OK).json({
      success: true,
      message: 'Post updated successfully',
      data: post,
    });
  }
);
export default updatePost;
