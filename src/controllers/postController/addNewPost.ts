import { CREATED } from './../../constants';
import { Request, Response, NextFunction } from 'express';

import catchAsync from '../../utils/catchAsync';
import Post from '../../models/Post';

import fs from 'fs/promises';
import savePostAttachments from '../../utils/savePostAttachments';
import { io } from '../../server';
import { ioEvents, ioActions } from '../../socketIo';

const addNewPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, content, category } = req.body;

    const userId = req.user?.id;
    const post = await (
      await Post.create({
        author: userId,
        title,
        content,
        category,
      })
    ).populate('category');
    await savePostAttachments(req, post);
    await post.save();

    const { attachment, ...postRes } = post.toObject();

    io.emit(ioEvents.POST, {
      action: ioActions.CREATE,
      post: {
        ...postRes,
        author: { name: req.user?.name, _id: req.user?._id },
      },
    });

    res.status(CREATED).json({
      success: true,
      message: req.i18n.t('postMsg.postAdded'),
      data: { post: postRes },
    });
  }
);
export default addNewPost;
