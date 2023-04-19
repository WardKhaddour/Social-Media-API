import { Request, Response, NextFunction } from 'express';

import catchAsync from '../../utils/catchAsync';
import { OK } from '../../constants';

const checkAuthenticated = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user!;

    res.status(OK).json({
      success: true,
      message: req.i18n.t('userAuthMsg.welcome'),
      data: {
        user: {
          name: user.name,
          email: user.email,
          photo: user.photo,
          emailIsConfirmed: user.emailIsConfirmed,
        },
      },
    });
  }
);

export default checkAuthenticated;
