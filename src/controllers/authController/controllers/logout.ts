import { Request, Response, NextFunction } from 'express';
import { OK } from '../../../constants';

const logout = (req: Request, res: Response, next: NextFunction) => {
  res.cookie('jwt', null);
  res.status(OK).json({
    success: true,
    message: 'Logged out successfully',
    data: null,
  });
};

export default logout;
