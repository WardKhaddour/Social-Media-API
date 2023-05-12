import { Types } from 'mongoose';
export interface PostDocInterface {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  title: string;
  content: string;
  category?: Types.ObjectId[];
  attachment?: { type: string; filePath: string; fileName: string }[];
  attachments?: { type: string; filePath: string; fileName: string }[];
  publishedAt?: Date;
  likesNum: number;
  commentsNum: number;
}
