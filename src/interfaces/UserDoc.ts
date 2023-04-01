import { Document } from 'mongoose';

export interface UserDocInterface extends Document {
  email: string;
  password: string;
  role: string;
  totalLoginAttempts: number;
  loginAttemptsAt: Date;
  name?: string;
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
