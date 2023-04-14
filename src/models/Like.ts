import mongoose from 'mongoose';
import { LikeDocInterface } from '../interfaces/documents/LikeDoc';

const LikeSchema = new mongoose.Schema<LikeDocInterface>({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Like = mongoose.model<LikeDocInterface>('Like', LikeSchema);

export default Like;
