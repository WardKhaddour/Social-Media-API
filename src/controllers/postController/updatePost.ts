import { NOT_FOUND, OK, FORBIDDEN } from './../../constants';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/AppError';
import Post from '../../models/Post';

const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, content, category } = req.body;
    const { postId } = req.params;
    const { user } = req;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new AppError(req.i18n.t('postMsg.noPost'), NOT_FOUND));
    }

    if (user?.role !== 'admin' && !post.author.equals(user?.id)) {
      return next(
        new AppError(req.i18n.t('userAuthMsg.noPermissions'), FORBIDDEN)
      );
    }
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    await post.save();
    res.status(OK).json({
      success: true,
      message: req.i18n.t('postMsg.postUpdated'),
      data: post,
    });
  }
);
export default updatePost;
