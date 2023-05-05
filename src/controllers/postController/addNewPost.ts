import { CREATED } from './../../constants';
import { Request, Response, NextFunction } from 'express';

import catchAsync from '../../utils/catchAsync';
import Post from '../../models/Post';

import fs from 'fs/promises';

const addNewPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, content, category } = req.body;

    const userId = req.user?.id;
    const post = await Post.create({
      author: userId,
      title,
      content,
      category,
    });

    const { attachments } = req;

    if (attachments) {
      for (const attachedFile of attachments) {
        attachedFile.filePath = attachedFile.filePath.replace(
          'postId',
          post._id.toString()
        );
        attachedFile.pathToSave = attachedFile.pathToSave.replace(
          'postId',
          post._id.toString()
        );

        if (attachedFile.type === 'image') {
          await attachedFile.file.writeAsync(attachedFile.pathToSave);
        } else if (attachedFile.type === 'pdf') {
          await fs.writeFile(attachedFile.pathToSave, attachedFile.file);
        } else if (attachedFile.type === 'video') {
          if (attachedFile.saveFile)
            await attachedFile.saveFile(attachedFile.pathToSave);
        }
        post.attachment?.push({
          fileName: attachedFile.fileName,
          filePath: attachedFile.filePath,
          type: attachedFile.type,
        });
      }
    }

    await post.save();

    const { attachment, ...postRes } = post.toObject();

    res.status(CREATED).json({
      success: true,
      message: req.i18n.t('postMsg.postAdded'),
      data: { post: postRes },
    });
  }
);
export default addNewPost;
