import { OK } from './../../constants';
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

    res.status(OK).json({
      success: true,
      message: req.i18n.t('userAuthMsg.deletedPhoto'),
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          photo: user.photo,
          emailIsConfirmed: user.emailIsConfirmed,
          hasPhoto: user.photoSrc !== 'default-user-photo.png',
        },
      },
    });
  }
);

export default deleteMyPhoto;
