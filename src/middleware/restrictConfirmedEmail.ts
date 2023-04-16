import express from 'express';

import catchAsync from '../utils/catchAsync';
import { UNAUTHORIZED } from '../constants';

const restrictConfirmedEmail = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const user = req.user!;

    if (!user.emailIsConfirmed) {
      return res.status(UNAUTHORIZED).json({
        success: false,
        message: req.i18n.t('userAuthMsg.unconfirmedEmail'),
        data: {
          user: {
            name: user.name,
            email: user.email,
          },
        },
      });
    }

    next();
  }
);

export default restrictConfirmedEmail;
