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
  if (
    file.mimetype.includes('image') ||
    file.mimetype.includes('pdf') ||
    file.mimetype.includes('video')
  ) {
    cb(null, true);
  } else {
    cb(new AppError(req.i18n.t('userAuthMsg.notSupportedType'), BAD_REQUEST));
  }
};

const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB Maximum file size
  },
  fileFilter: multerFilter,
});

export default upload.array('attachments', 3);
