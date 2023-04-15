import { Request, Response, NextFunction, query } from 'express';

import User from '../../models/User';

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const query = User.findById(userId).populate('posts');

  query.setOptions({
    notAuth: true,
  });

  const user = await query;
  res.status(200).json({
    success: true,
    message: req.i18n.t('msg.gotUserSuccess'),
    data: {
      user,
    },
  });
};
export default getUserById;
