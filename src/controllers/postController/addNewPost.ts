import { CREATED } from './../../constants';
import { Request, Response, NextFunction } from 'express';

import catchAsync from '../../utils/catchAsync';
import Post from '../../models/Post';

const addNewPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, content } = req.body;
    const userId = req.user?.id;
    const post = await Post.create({
      author: userId,
      title,
      content,
    });

    res.status(CREATED).json({
      success: true,
      message: req.i18n.t('postMsg.postAdded'),
      data: {post},
    });
  }
);
export default addNewPost;
