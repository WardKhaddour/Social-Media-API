import { Request, Response, NextFunction } from 'express';
import jimp from 'jimp';
import fs from 'fs/promises';
import ffmpeg from 'fluent-ffmpeg';

const formatAttachments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const attachments = [];

  if (!req.files) {
    return next();
  }

  for (const file of req.files as Express.Multer.File[]) {
    //Format images
    if (file.mimetype.includes('image')) {
      file.filename = `post-postId-user-${req.user?.id}-${Date.now()}.jpeg`;
      const photo = (await jimp.read(file.buffer)).resize(500, 500).quality(90);

      const filePath = `posts/images/${file.filename}`;

      attachments.push({
        fileName: file.originalname,
        type: 'image',
        filePath,
        pathToSave: `public/${filePath}`,
        file: photo,
      });
    }

    //Format PDF
    else if (file.mimetype.includes('pdf')) {
      file.filename = `post-postId-user-${req.user?.id}-${Date.now()}.pdf`;
      const filePath = `posts/pdf/${file.filename}`;
      attachments.push({
        fileName: file.originalname,
        type: 'pdf',
        filePath,
        pathToSave: `public/${filePath}`,
        file: file.buffer,
      });
    }

    // Format Videos
    else if (file.mimetype.includes('video')) {
      file.filename = `post-postId-user-${req.user?.id}-${Date.now()}`;
      const tempFilePath = `public/posts/videos/${file.filename}`;
      await fs.writeFile(tempFilePath, file.buffer);

      const saveVideo = (filePath: string) => {
        return new Promise<void>((resolve, reject) => {
          const processedVideo = ffmpeg(tempFilePath)
            .size('640x360')
            .videoCodec('libx264')
            .audioCodec('aac')
            .format('mp4')
            .output(filePath);
          processedVideo.on('end', async () => {
            await fs.unlink(tempFilePath);
            resolve();
          });
          processedVideo.on('error', async err => {
            await fs.unlink(tempFilePath);
            reject(err);
          });

          processedVideo.run();
        });
      };
      const filePath = `posts/videos/${file.filename}.mp4`;

      attachments.push({
        fileName: file.originalname,
        type: 'video',
        filePath: `posts/videos/${file.filename}.mp4`,
        pathToSave: `public/${filePath}`,
        saveFile: saveVideo,
      });
    }
  }

  req.attachments = attachments;
  next();
};

export default formatAttachments;
