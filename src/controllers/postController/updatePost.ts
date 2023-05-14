import { NOT_FOUND, OK, FORBIDDEN } from './../../constants';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/AppError';
import Post from '../../models/Post';
import savePostAttachments from '../../utils/savePostAttachments';
import { io } from '../../server';
import { ioActions, ioEvents } from '../../socketIo';

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
    await savePostAttachments(req, post);

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    await post.save();

    io.emit(ioEvents.POST, {
      action: ioActions.UPDATE,
      post: {
        ...post.toObject(),
        author: { name: req.user?.name, _id: req.user?._id },
      },
    });

    res.status(OK).json({
      success: true,
      message: req.i18n.t('postMsg.postUpdated'),
      data: post,
    });
  }
);
export default updatePost;
