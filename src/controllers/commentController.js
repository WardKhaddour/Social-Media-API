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
exports.deleteComment = exports.updateComment = exports.getCommentsOnPost = exports.addNewComment = void 0;
const mongodb_1 = require("mongodb");
const constants_1 = require("./../constants");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const Comment_1 = __importDefault(require("../models/Comment"));
const Post_1 = __importDefault(require("../models/Post"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const __1 = require("..");
const socketIo_1 = require("../socketIo");
exports.addNewComment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { postId } = req.params;
    const { content } = req.body;
    if (!mongodb_1.ObjectId.isValid(postId)) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.serverError'), constants_1.SERVER_ERROR));
    }
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return next(new AppError_1.default(req.i18n.t('postMsg.noPost'), constants_1.NOT_FOUND));
    }
    const user = req.user;
    const comment = yield Comment_1.default.create({
        post: postId,
        user: user === null || user === void 0 ? void 0 : user.id,
        content,
    });
    post.commentsNum++;
    yield (post === null || post === void 0 ? void 0 : post.save({ validateBeforeSave: false }));
    __1.io.emit(socketIo_1.ioEvents.COMMENT, {
        action: socketIo_1.ioActions.CREATE,
        data: {
            comment: Object.assign(Object.assign({}, comment.toObject()), { user: {
                    name: (_a = req.user) === null || _a === void 0 ? void 0 : _a.name,
                    _id: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
                    photo: (_c = req.user) === null || _c === void 0 ? void 0 : _c.photo,
                } }),
            post: post._id,
            commentsNum: post.commentsNum,
        },
    });
    res.status(200).json({
        success: true,
    });
}));
exports.getCommentsOnPost = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    if (!mongodb_1.ObjectId.isValid(postId)) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.serverError'), constants_1.SERVER_ERROR));
    }
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return next(new AppError_1.default(req.i18n.t('postMsg.noPost'), constants_1.NOT_FOUND));
    }
    const comments = yield Comment_1.default.find({
        post: post.id,
    }).populate({
        path: 'user',
        select: 'name photoSrc photo',
    });
    res.status(200).json({
        success: true,
        data: { comments },
    });
}));
exports.updateComment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    const { content } = req.body;
    const { commentId } = req.params;
    const { user } = req;
    if (!mongodb_1.ObjectId.isValid(commentId)) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.serverError'), constants_1.SERVER_ERROR));
    }
    const comment = yield Comment_1.default.findById(commentId);
    if (!comment) {
        return next(new AppError_1.default(req.i18n.t('commentMsg.noComment'), constants_1.NOT_FOUND));
    }
    if (!comment.user.equals(user === null || user === void 0 ? void 0 : user.id)) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.noPermissions'), constants_1.FORBIDDEN));
    }
    comment.content = content || comment.content;
    yield comment.save();
    __1.io.emit(socketIo_1.ioEvents.COMMENT, {
        action: socketIo_1.ioActions.UPDATE,
        data: {
            post: comment.post,
            comment: Object.assign(Object.assign({}, comment.toObject()), { user: {
                    name: (_d = req.user) === null || _d === void 0 ? void 0 : _d.name,
                    _id: (_e = req.user) === null || _e === void 0 ? void 0 : _e._id,
                    photo: (_f = req.user) === null || _f === void 0 ? void 0 : _f.photo,
                } }),
        },
    });
    res.status(constants_1.OK).json({
        success: true,
        message: req.i18n.t('commentMsg.commentUpdated'),
        data: { comment },
    });
}));
exports.deleteComment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, commentId } = req.params;
    const { user } = req;
    if (!mongodb_1.ObjectId.isValid(commentId) || !mongodb_1.ObjectId.isValid(postId)) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.serverError'), constants_1.SERVER_ERROR));
    }
    if (!mongodb_1.ObjectId.isValid(commentId) || !mongodb_1.ObjectId.isValid(postId)) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.serverError'), constants_1.SERVER_ERROR));
    }
    const [post, comment] = yield Promise.all([
        Post_1.default.findById(postId),
        Comment_1.default.findById(commentId),
    ]);
    if (!comment) {
        return next(new AppError_1.default(req.i18n.t('commentMsg.noComment'), constants_1.NOT_FOUND));
    }
    if (!post) {
        return next(new AppError_1.default(req.i18n.t('postMsg.noPost'), constants_1.NOT_FOUND));
    }
    if (!comment.user.equals(user === null || user === void 0 ? void 0 : user.id)) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.noPermissions'), constants_1.FORBIDDEN));
    }
    post.commentsNum = post.commentsNum - 1;
    yield Promise.all([comment.deleteOne(), post.save()]);
    __1.io.emit(socketIo_1.ioEvents.COMMENT, {
        action: socketIo_1.ioActions.DELETE,
        data: {
            comment: comment._id,
            post: comment.post._id,
            commentsNum: post.commentsNum,
        },
    });
    res.status(constants_1.DELETED).json({
        success: true,
    });
}));
