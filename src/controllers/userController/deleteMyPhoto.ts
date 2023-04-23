import { DELETED } from './../../constants';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import { deleteFile } from '../../utils/file';

 const deleteMyPhoto = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user!;
    if (user.photoSrc !== 'default-user-photo.png') {
      deleteFile(`public/images/users/${user.photoSrc}`);
      user.photoSrc = 'default-user-photo.png';
    }
    await user.save({ validateBeforeSave: false });

    res.status(DELETED).json({
      success: true,
      message: 'Photo Deleted Successfully',
    });
  }
);

export default deleteMyPhoto;