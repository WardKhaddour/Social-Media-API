import { PostDocInterface } from './../interfaces/documents/PostDoc';
import { Request } from 'express';
import fs from 'fs/promises';

const savePostAttachments = async (req: Request, post: PostDocInterface) => {
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
};

export default savePostAttachments;
