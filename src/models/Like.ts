import mongoose, { Types } from 'mongoose';
import { LikeDocInterface } from '../interfaces/documents/LikeDoc';

const LikeSchema = new mongoose.Schema<LikeDocInterface>({
  post: {
    type: Types.ObjectId,
    ref: 'Post',
  },
  user: {
    type: Types.ObjectId,
    ref: 'User',
  },
});

const Like = mongoose.model<LikeDocInterface>('Like', LikeSchema);

export default Like;
