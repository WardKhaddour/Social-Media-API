import { Types } from 'mongoose';

export interface PostDocInterface {
  author: Types.ObjectId;
  title: string;
  content: string;
  category?: string[];
  attachment?: string;
  publishedAt?: Date;
  likesNum: number;
  commentsNum: number;
}
