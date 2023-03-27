import { UserDocInterface } from '../../interfaces/UserDoc';
declare global {
  namespace Express {
    interface Request {
      user?: UserDocInterface;
    }
  }
}
