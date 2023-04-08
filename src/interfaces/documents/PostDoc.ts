import { ObjectId } from 'mongoose';

export interface PostDocInterface {
  author: ObjectId;
  title: string;
  content: string;
  publishedAt?: Date;
  likesNum: number;
  commentsNum: number;
}
