import { Request, Response, NextFunction } from 'express';

import User from '../../models/User';

const getUserData = async (req: Request, res: Response, next: NextFunction) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    message: req.i18n.t('msg.gotUserSuccess'),
    data: {
      users,
      user: {
        email: req.user?.email,
        name: req.user?.name,
      },
    },
  });
};
export default getUserData;
