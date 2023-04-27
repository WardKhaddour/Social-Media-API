import { Request, Response, NextFunction } from 'express';

import catchAsync from '../../utils/catchAsync';
import Email from '../../utils/Email';
import AppError from '../../utils/AppError';
import { OK, SERVER_ERROR } from '../../constants';
import { deleteFile } from '../../utils/file';

const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, bio } = req.body;
    const user = req.user!;
    let photo = null;
    let oldPhotoPath: string | null = null;
    if (req.file) {
      photo = req.file.filename;
      if (user.photoSrc !== 'default-user-photo.png') {
        oldPhotoPath = `public/images/users/${req.user?.photoSrc}`;
      }
    }

    let resMessage = req.i18n.t('userAuthMsg.userUpdated');

    if (email && user.email !== email) {
      user.email = email;
      user.emailIsConfirmed = false;
      resMessage += req.i18n.t('userAuthMsg.confirmNewEmail');
      const confirmToken = user.createEmailConfirmToken();

      try {
        const email = new Email(user.email, confirmToken);
        await email.sendEmailConfirm();
      } catch (error) {
        user.emailConfirmToken = undefined;
        user.emailConfirmExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
          new AppError(
            req.i18n.t('userAuthMsg.serverErrorOccurred'),
            SERVER_ERROR
          )
        );
      }
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.photoSrc = photo || user.photoSrc;

    await user.save({ validateBeforeSave: false });
    if (photo && oldPhotoPath) {
      deleteFile(oldPhotoPath);
    }
    res.status(OK).json({
      success: true,
      message: resMessage,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          bio: user.bio,
          email: user.email,
          photo: user.photo,
          emailIsConfirmed: user.emailIsConfirmed,
          hasPhoto: user.photoSrc !== 'default-user-photo.png',
        },
      },
    });
  }
);

export default updateMe;
