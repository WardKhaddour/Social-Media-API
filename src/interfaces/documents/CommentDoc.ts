import { ObjectId } from 'mongoose';

export interface CommentDocInterface {
  post: ObjectId;
  user: ObjectId;
  content: string;
  addedAt: Date;
}
