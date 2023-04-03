import { Request, Response, NextFunction } from 'express';
import jimp from 'jimp';

const resizeUserPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user?.id}-${Date.now()}.jpeg`;
  const photo = await jimp.read(req.file.buffer);
  photo.resize(500, 500).quality(90);
  await photo.writeAsync(`public/images/users/${req.file.filename}`);
  next();
};

export default resizeUserPhoto;
