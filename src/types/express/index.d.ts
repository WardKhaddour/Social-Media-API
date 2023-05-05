import { UserDocInterface } from '../../interfaces/documents/UserDoc';
declare global {
  namespace Express {
    interface Request {
      user?: UserDocInterface;
      attachments?: {
        type: string;
        fileName: string;
        filePath: string;
        pathToSave: string;
        file?: any;
        saveFile?: any;
      }[];
    }
    interface Locals {
      error?: { message: string; statusCode: number };
    }
  }
}
