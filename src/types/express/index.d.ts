import { UserDocInterface } from '../../interfaces/documents/UserDoc';
declare global {
  namespace Express {
    interface Request {
      user?: UserDocInterface;
    }
  }
}
