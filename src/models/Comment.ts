import mongoose, { Types } from 'mongoose';
import { CommentDocInterface } from '../interfaces/documents/CommentDoc';

const CommentSchema = new mongoose.Schema<CommentDocInterface>({
  post: {
    type: Types.ObjectId,
    ref: 'Post',
  },
  user: {
    type: Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Comment = mongoose.model<CommentDocInterface>('Comment', CommentSchema);

export default Comment;
