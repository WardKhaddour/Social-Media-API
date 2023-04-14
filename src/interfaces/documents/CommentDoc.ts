import { Types } from 'mongoose';

export interface CommentDocInterface {
  post: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  addedAt: Date;
}
