import mongoose from 'mongoose';
import { PostDocInterface } from '../interfaces/documents/PostDoc';

const PostSchema = new mongoose.Schema<PostDocInterface>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Category',
    },
    attachment: String,
    likesNum: {
      type: Number,
      default: 0,
    },
    commentsNum: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

PostSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
});

const Post = mongoose.model<PostDocInterface>('Post', PostSchema);

export default Post;
