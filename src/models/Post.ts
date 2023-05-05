import mongoose from 'mongoose';
import { PostDocInterface } from '../interfaces/documents/PostDoc';

const PostSchema = new mongoose.Schema<PostDocInterface>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    attachment: {
      type: [
        {
          type: { type: String, required: true },
          filePath: { type: String, required: true },
          fileName: { type: String, required: true },
        },
      ],
      default: [],
    },
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

PostSchema.virtual('attachments').get(function () {
  const currentUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.PROD_URL
      : process.env.DEV_URL;
  if (!!this.attachment?.length) {
    const attachments = this.attachment?.map(attach => {
      return {
        fileName: attach.fileName,
        type: attach.type,
        url: `${currentUrl}/${attach.filePath}`,
      };
    });

    return attachments;
  }
  return undefined;
});

PostSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
});

const Post = mongoose.model<PostDocInterface>('Post', PostSchema);

export default Post;
