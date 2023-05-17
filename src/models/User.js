"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const isValidEmail_1 = require("../validators/isValidEmail");
const UserSchema = new mongoose_1.default.Schema({
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
            validator: isValidEmail_1.isValidEmail,
        },
    },
    bio: {
        type: String,
        default: 'New User',
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
    photoSrc: {
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
    followersNum: {
        type: Number,
        default: 0,
    },
    followingNum: {
        type: Number,
        default: 0,
    },
    savedPosts: [mongoose_1.default.Schema.Types.ObjectId],
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
}, {
    methods: {
        isCorrectPassword: function (candidatePassword, userPassword) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield bcryptjs_1.default.compare(candidatePassword, userPassword);
            });
        },
        changedPasswordAfter: function (JWTTimestamp) {
            if (this.passwordChangedAt) {
                const changedTimestamp = parseInt(`${this.passwordChangedAt.getTime() / 1000}`, 10);
                return JWTTimestamp < changedTimestamp;
            }
            //False means not changed
            return false;
        },
        createEmailConfirmToken: function () {
            const confirmToken = crypto_1.default.randomBytes(32).toString('hex');
            this.emailConfirmToken = crypto_1.default
                .createHash('sha256')
                .update(confirmToken)
                .digest('hex');
            this.emailConfirmExpires = new Date(Date.now() + 10 * 60 * 1000);
            return confirmToken;
        },
        createPasswordResetToken: function () {
            const resetToken = crypto_1.default.randomBytes(32).toString('hex');
            this.passwordResetToken = crypto_1.default
                .createHash('sha256')
                .update(resetToken)
                .digest('hex');
            this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
            return resetToken;
        },
        cannotTryLogin: function () {
            return (this.totalLoginAttempts <= 0 &&
                this.loginAttemptsAt > new Date(Date.now()));
        },
        handleLoginAttemptFail: function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.totalLoginAttempts--;
                if (this.totalLoginAttempts <= 0) {
                    this.loginAttemptsAt = new Date(Date.now() + 60000 * 60);
                }
                yield this.save();
            });
        },
        resetTotalAttempts: function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.totalLoginAttempts = 10;
                yield this.save();
            });
        },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
UserSchema.virtual('posts', {
    ref: 'Post',
    foreignField: 'author',
    localField: '_id',
});
UserSchema.virtual('follower', {
    ref: 'Follow',
    foreignField: 'follower',
    localField: '_id',
});
UserSchema.virtual('following', {
    ref: 'Follow',
    foreignField: 'following',
    localField: '_id',
});
UserSchema.virtual('photo').get(function () {
    const currentUrl = process.env.NODE_ENV === 'production'
        ? process.env.PROD_URL
        : process.env.DEV_URL;
    const userPhotoSrc = `${currentUrl}/images/users/${this.photoSrc}`;
    return userPhotoSrc;
});
UserSchema.pre(/^find/, function (next) {
    if (!this.getOptions().disableMiddleware) {
        this.find({ active: true });
    }
    next();
});
UserSchema.pre(/^find/, function (next) {
    if (this.getOptions().notAuthData) {
        this.select('-totalLoginAttempts -role -__v -emailIsConfirmed -passwordChangedAt -savedPosts');
    }
    next();
});
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password') || this.isNew)
            return next();
        this.passwordChangedAt = new Date(Date.now() - 1000);
        next();
    });
});
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        //Only run if password was modified
        if (!this.isModified('password')) {
            return next();
        }
        //hash the password
        this.password = yield bcryptjs_1.default.hash(this.password, 12);
        next();
    });
});
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
