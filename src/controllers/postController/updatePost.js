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
const constants_1 = require("./../../constants");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const Post_1 = __importDefault(require("../../models/Post"));
const savePostAttachments_1 = __importDefault(require("../../utils/savePostAttachments"));
const __1 = require("../..");
const socketIo_1 = require("../../socketIo");
const mongodb_1 = require("mongodb");
const updatePost = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { title, content, category } = req.body;
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
    yield (0, savePostAttachments_1.default)(req, post);
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    yield post.save();
    __1.io.emit(socketIo_1.ioEvents.POST, {
        action: socketIo_1.ioActions.UPDATE,
        post: Object.assign(Object.assign({}, post.toObject()), { author: { name: (_a = req.user) === null || _a === void 0 ? void 0 : _a.name, _id: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id } }),
    });
    res.status(constants_1.OK).json({
        success: true,
        message: req.i18n.t('postMsg.postUpdated'),
        data: post,
    });
}));
exports.default = updatePost;
