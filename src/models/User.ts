import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { isValidEmail } from '../validators/isValidEmail';
import { UserDocInterface } from '../interfaces/UserDoc';

const UserSchema = new mongoose.Schema<UserDocInterface>(
  {
    name: {
      type: String,
      required: false,
      default: 'New User',
    },
    email: {
      type: String,
      required: [true, 'Please provide an E-Mail'],
      unique: true,
      lowercase: true,
      validate: {
        validator: isValidEmail,
      },
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    totalLoginAttempts: {
      type: Number,
      required: true,
      default: 10,
    },
    loginAttemptsAt: Date,
    photo: {
      type: String,
      required: false,
      default: 'default-user-photo.png',
    },
    role: {
      type: String,
      required: true,
      default: 'user',
      enum: ['user', 'admin'],
    },
    passwordChangedAt: Date,
    emailConfirmToken: String,
    emailConfirmExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailIsConfirmed: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    methods: {
      isCorrectPassword: async function (
        candidatePassword: string,
        userPassword: string
      ): Promise<boolean> {
        return await bcrypt.compare(candidatePassword, userPassword);
      },

      changedPasswordAfter: function (JWTTimestamp: number) {
        if (this.passwordChangedAt) {
          const changedTimestamp = parseInt(
            `${this.passwordChangedAt.getTime() / 1000}`,
            10
          );
          return JWTTimestamp < changedTimestamp;
        }

        //False means not changed
        return false;
      },
      createEmailConfirmToken: function (): string {
        const confirmToken = crypto.randomBytes(32).toString('hex');
        this.emailConfirmToken = crypto
          .createHash('sha256')
          .update(confirmToken)
          .digest('hex');

        this.emailConfirmExpires = new Date(Date.now() + 10 * 60 * 1000);

        return confirmToken;
      },

      createPasswordResetToken: function (): string {
        const resetToken = crypto.randomBytes(32).toString('hex');
        this.passwordResetToken = crypto
          .createHash('sha256')
          .update(resetToken)
          .digest('hex');

        this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

        return resetToken;
      },

      cannotTryLogin: function (): boolean {
        return (
          this.totalLoginAttempts <= 0 &&
          this.loginAttemptsAt > new Date(Date.now())
        );
      },

      handleLoginAttemptFail: async function (): Promise<void> {
        this.totalLoginAttempts--;
        if (this.totalLoginAttempts <= 0) {
          this.loginAttemptsAt = new Date(Date.now() + 60000 * 60);
        }
        await this.save();
      },

      resetTotalAttempts: async function (): Promise<void> {
        this.totalLoginAttempts = 10;
        await this.save();
      },
    },
  }
);

UserSchema.pre(/^find/, function (next) {
  if (!this.getOptions().disableMiddleware) {
    this.find({ active: true });
  }

  next();
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);

  next();
});

UserSchema.pre('save', async function (next) {
  //Only run if password was modified
  if (!this.isModified('password')) {
    return next();
  }

  //hash the password

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model<UserDocInterface>('User', UserSchema);

export default User;
