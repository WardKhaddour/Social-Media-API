import { ObjectId } from 'mongoose';

export interface LikeDocInterface {
  post: ObjectId;
  user: ObjectId;
}
