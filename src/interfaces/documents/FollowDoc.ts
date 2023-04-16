import { Types } from 'mongoose';

export interface FollowDocInterface {
  follower: Types.ObjectId;
  following: Types.ObjectId;
}
