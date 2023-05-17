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
const promises_1 = __importDefault(require("fs/promises"));
const __1 = require("../..");
const socketIo_1 = require("../../socketIo");
const mongodb_1 = require("mongodb");
const deletePost = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { postId } = req.params;
    const { user } = req;
    if (!mongodb_1.ObjectId.isValid(postId)) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.serverError'), constants_1.SERVER_ERROR));
    }
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return next(new AppError_1.default(req.i18n.t('postMsg.noPost'), constants_1.NOT_FOUND));
    }
    if ((user === null || user === void 0 ? void 0 : user.role) !== 'admin' && !post.author.equals(user === null || user === void 0 ? void 0 : user.id)) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.noPermissions'), constants_1.FORBIDDEN));
    }
    (_a = post.attachment) === null || _a === void 0 ? void 0 : _a.forEach((attach) => __awaiter(void 0, void 0, void 0, function* () {
        yield promises_1.default.unlink(`public/${attach.filePath}`);
    }));
    yield post.deleteOne();
    __1.io.emit(socketIo_1.ioEvents.POST, {
        action: socketIo_1.ioActions.DELETE,
        post: post._id,
    });
    res.status(constants_1.DELETED).json({
        success: true,
        message: req.i18n.t('postMsg.postDeleted'),
    });
}));
exports.default = deletePost;
