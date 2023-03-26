import { UserDocInterface } from '../../models/User';
declare global {
  namespace Express {
    interface Request {
      user?: UserDocInterface;
    }
  }
}
