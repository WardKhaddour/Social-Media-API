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
const constants_1 = require("../../constants");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Post_1 = __importDefault(require("../../models/Post"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const __1 = require("../..");
const socketIo_1 = require("../../socketIo");
const mongodb_1 = require("mongodb");
const toggleSavePost = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { postId } = req.params;
    if (!mongodb_1.ObjectId.isValid(postId)) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.serverError'), constants_1.SERVER_ERROR));
    }
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return next(new AppError_1.default(req.i18n.t('postMsg.noPost'), constants_1.BAD_REQUEST));
    }
    const savedPostIndex = user.savedPosts.indexOf(post._id);
    if (savedPostIndex !== -1) {
        user.savedPosts.splice(savedPostIndex, 1);
    }
    else {
        user.savedPosts.push(post._id);
    }
    yield user.save();
    if (req.socketId) {
        __1.io.to(req.socketId).emit(socketIo_1.ioEvents.SAVE_POST, {
            action: socketIo_1.ioActions.UPDATE,
            data: {
                post: post._id,
                isSaved: user.savedPosts.includes(post._id),
            },
        });
    }
    res.status(constants_1.OK).json({
        success: true,
        data: {
            user,
        },
    });
}));
exports.default = toggleSavePost;
