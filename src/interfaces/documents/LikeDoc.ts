import { Types } from 'mongoose';

export interface LikeDocInterface {
  post: Types.ObjectId;
  user: Types.ObjectId;
}
