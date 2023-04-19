import { Types, Document } from 'mongoose';

export interface UserDocInterface extends Document {
  email: string;
  password: string;
  role: string;
  followersNum: number;
  followingNum: number;
  savedPosts: [Types.ObjectId];
  totalLoginAttempts: number;
  loginAttemptsAt: Date;
  name?: string;
  photoSrc?: String;
  photo?: String;
  passwordChangedAt?: Date;
  emailConfirmToken?: String;
  emailConfirmExpires?: Date;
  passwordResetToken?: String;
  passwordResetExpires?: Date;
  emailIsConfirmed: boolean;
  active: boolean;
  isCorrectPassword(arg0: string, arg1: string): Promise<boolean>;
  changedPasswordAfter(arg0: number): boolean;
  createEmailConfirmToken(): string;
  createPasswordResetToken(): string;
  cannotTryLogin(): boolean;
  handleLoginAttemptFail(): Promise<void>;
  resetTotalAttempts(): Promise<void>;
}
