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
exports.toggleLike = void 0;
const constants_1 = require("./../constants");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const Like_1 = __importDefault(require("../models/Like"));
const Post_1 = __importDefault(require("../models/Post"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const __1 = require("..");
const socketIo_1 = require("../socketIo");
const mongodb_1 = require("mongodb");
exports.toggleLike = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    if (!mongodb_1.ObjectId.isValid(postId)) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.serverError'), constants_1.SERVER_ERROR));
    }
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return next(new AppError_1.default('', constants_1.NOT_FOUND));
    }
    const user = req.user;
    const prevLike = yield Like_1.default.findOne({
        user: user === null || user === void 0 ? void 0 : user.id,
        post: postId,
    });
    if (prevLike) {
        yield Like_1.default.deleteOne({
            _id: prevLike.id,
        });
        post.likesNum--;
    }
    else {
        yield Like_1.default.create({
            post: postId,
            user: user === null || user === void 0 ? void 0 : user.id,
        });
        post.likesNum++;
    }
    yield (post === null || post === void 0 ? void 0 : post.save({ validateBeforeSave: false }));
    if (req.socketId) {
        __1.io.to(req.socketId).emit(socketIo_1.ioEvents.LIKE, {
            action: socketIo_1.ioActions.UPDATE,
            data: { post: post._id, isLiked: !prevLike, likesNum: post.likesNum },
        });
    }
    __1.io.emit(socketIo_1.ioEvents.LIKE, {
        action: socketIo_1.ioActions.UPDATE,
        data: {
            post: post._id,
            likesNum: post.likesNum,
        },
    });
    res.status(200).json({
        success: true,
    });
}));
