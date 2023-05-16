import { BAD_REQUEST, SERVER_ERROR, UNAUTHORIZED } from './../../constants';
import { DELETED } from '../../constants';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import Post from '../../models/Post';
import AppError from '../../utils/AppError';
import fs from 'fs/promises';
import { ObjectId } from 'mongodb';

const deletePostAttachment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, attachmentName } = req.params;
    const user = req.user;
    if (!postId || !attachmentName) {
      return next(new AppError(req.i18n.t('postMsg.noPost'), BAD_REQUEST));
    }
    if (!ObjectId.isValid(postId)) {
      return next(
        new AppError(req.i18n.t('userAuthMsg.serverError'), SERVER_ERROR)
      );
    }
    const post = await Post.findById(postId);

    if (!post) {
      return next(new AppError(req.i18n.t('postMsg.noPost'), BAD_REQUEST));
    }
    if (!post.author._id.equals(user?._id)) {
      return next(
        new AppError(req.i18n.t('userAuthMsg.noPermissions'), UNAUTHORIZED)
      );
    }

    let attachmentPath;

    post.attachment = post.attachment?.filter(attach => {
      if (attach.fileName === attachmentName) attachmentPath = attach.filePath;
      return attach.fileName !== attachmentName;
    });

    if (attachmentPath) {
      await Promise.all([post.save(), fs.unlink(`public/${attachmentPath}`)]);
    }

    res.status(DELETED).json({
      success: true,
    });
  }
);

export default deletePostAttachment;
