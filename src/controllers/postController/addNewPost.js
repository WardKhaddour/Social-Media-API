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
const constants_1 = require("./../../constants");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Post_1 = __importDefault(require("../../models/Post"));
const savePostAttachments_1 = __importDefault(require("../../utils/savePostAttachments"));
const __1 = require("../..");
const socketIo_1 = require("../../socketIo");
const addNewPost = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { title, content, category } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const post = yield (yield Post_1.default.create({
        author: userId,
        title,
        content,
        category,
    })).populate('category');
    yield (0, savePostAttachments_1.default)(req, post);
    yield post.save();
    const _d = post.toObject(), { attachment } = _d, postRes = __rest(_d, ["attachment"]);
    __1.io.emit(socketIo_1.ioEvents.POST, {
        action: socketIo_1.ioActions.CREATE,
        post: Object.assign(Object.assign({}, postRes), { author: { name: (_b = req.user) === null || _b === void 0 ? void 0 : _b.name, _id: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id } }),
    });
    res.status(constants_1.CREATED).json({
        success: true,
        message: req.i18n.t('postMsg.postAdded'),
        data: { post: postRes },
    });
}));
exports.default = addNewPost;
