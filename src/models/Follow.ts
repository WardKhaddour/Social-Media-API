import mongoose from 'mongoose';
import { FollowDocInterface } from '../interfaces/documents/FollowDoc';

const FollowSchema = new mongoose.Schema<FollowDocInterface>({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Follow = mongoose.model<FollowDocInterface>('Follow', FollowSchema);

export default Follow;
