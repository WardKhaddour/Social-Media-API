import { NOT_FOUND, FORBIDDEN, DELETED } from '../../constants';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import Post from '../../models/Post';
import AppError from '../../utils/AppError';
import fs from 'fs/promises';

const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
    post.attachment?.forEach(async attach => {
      await fs.unlink(`public/${attach.filePath}`);
    });
    await post.deleteOne();
    res.status(DELETED).json({
      success: true,
      message: req.i18n.t('postMsg.postDeleted'),
    });
  }
);

export default deletePost;
