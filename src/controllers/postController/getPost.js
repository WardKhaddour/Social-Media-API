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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPost = void 0;
const constants_1 = require("../../constants");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Post_1 = __importDefault(require("../../models/Post"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const Like_1 = __importDefault(require("../../models/Like"));
const mongodb_1 = require("mongodb");
exports.getPost = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    if (!mongodb_1.ObjectId.isValid(postId)) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.serverError'), constants_1.SERVER_ERROR));
    }
    const post = yield Post_1.default.findById(postId).populate('category').populate({
        path: 'author',
        select: 'name _id',
    });
    if (!post) {
        return next(new AppError_1.default(req.i18n.t('postMsg.noPost'), constants_1.NOT_FOUND));
    }
    let isLiked = false;
    let isSaved = false;
    const user = req.user;
    if (user) {
        isLiked = !!(yield Like_1.default.findOne({
            user: user === null || user === void 0 ? void 0 : user.id,
            post: postId,
        }));
        isSaved = !!user.savedPosts.includes(post._id);
    }
    const _a = post.toObject(), { attachment } = _a, postRes = __rest(_a, ["attachment"]);
    res.status(constants_1.OK).json({
        success: true,
        data: {
            post: Object.assign(Object.assign({}, postRes), { isLiked, isSaved }),
        },
    });
}));
exports.default = exports.getPost;
