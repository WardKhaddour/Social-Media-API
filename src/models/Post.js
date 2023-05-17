"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
            type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
PostSchema.virtual('attachments').get(function () {
    var _a, _b;
    const currentUrl = process.env.NODE_ENV === 'production'
        ? process.env.PROD_URL
        : process.env.DEV_URL;
    if (!!((_a = this.attachment) === null || _a === void 0 ? void 0 : _a.length)) {
        const attachments = (_b = this.attachment) === null || _b === void 0 ? void 0 : _b.map(attach => {
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
const Post = mongoose_1.default.model('Post', PostSchema);
exports.default = Post;
