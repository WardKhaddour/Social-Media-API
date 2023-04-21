import { UserDocInterface } from '../../interfaces/documents/UserDoc';
declare global {
  namespace Express {
    interface Request {
      user?: UserDocInterface;
    }
    interface Locals {
      error?: { message: string; statusCode: number };
    }
  }
}
