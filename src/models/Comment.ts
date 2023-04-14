import mongoose from 'mongoose';
import { CommentDocInterface } from '../interfaces/documents/CommentDoc';

const CommentSchema = new mongoose.Schema<CommentDocInterface>({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
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
