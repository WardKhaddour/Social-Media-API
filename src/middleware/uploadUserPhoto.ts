import { Request } from 'express';
import multer from 'multer';
import { BAD_REQUEST } from '../constants';
import AppError from '../utils/AppError';

const multerStorage = multer.memoryStorage();

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Not an image! Please upload only images', BAD_REQUEST));
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export default upload.single('photo');
