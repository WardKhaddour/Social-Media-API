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
const constants_2 = require("../../constants");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Post_1 = __importDefault(require("../../models/Post"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const promises_1 = __importDefault(require("fs/promises"));
const mongodb_1 = require("mongodb");
const deletePostAttachment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { postId, attachmentName } = req.params;
    const user = req.user;
    if (!postId || !attachmentName) {
        return next(new AppError_1.default(req.i18n.t('postMsg.noPost'), constants_1.BAD_REQUEST));
    }
    if (!mongodb_1.ObjectId.isValid(postId)) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.serverError'), constants_1.SERVER_ERROR));
    }
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return next(new AppError_1.default(req.i18n.t('postMsg.noPost'), constants_1.BAD_REQUEST));
    }
    if (!post.author._id.equals(user === null || user === void 0 ? void 0 : user._id)) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.noPermissions'), constants_1.UNAUTHORIZED));
    }
    let attachmentPath;
    post.attachment = (_a = post.attachment) === null || _a === void 0 ? void 0 : _a.filter(attach => {
        if (attach.fileName === attachmentName)
            attachmentPath = attach.filePath;
        return attach.fileName !== attachmentName;
    });
    if (attachmentPath) {
        yield Promise.all([post.save(), promises_1.default.unlink(`public/${attachmentPath}`)]);
    }
    res.status(constants_2.DELETED).json({
        success: true,
    });
}));
exports.default = deletePostAttachment;
