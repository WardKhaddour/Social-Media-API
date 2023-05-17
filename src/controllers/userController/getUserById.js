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
const User_1 = __importDefault(require("../../models/User"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const Follow_1 = __importDefault(require("../../models/Follow"));
const mongodb_1 = require("mongodb");
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const currentUser = req.user;
    if (!mongodb_1.ObjectId.isValid(userId)) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.serverError'), constants_1.SERVER_ERROR));
    }
    const query = User_1.default.findById(userId).populate({
        path: 'posts',
        populate: {
            path: 'category',
        },
    });
    if (userId === (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id)) {
        query.select('-email -savedPosts');
    }
    else {
        query.select('-email -savedPosts -following');
    }
    query.setOptions({
        notAuthData: true,
    });
    const user = yield query;
    if (!user) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.noUser'), constants_1.NOT_FOUND));
    }
    const isFollowing = !!(yield Follow_1.default.findOne({
        follower: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id,
        following: user._id,
    }));
    res.status(constants_1.OK).json({
        success: true,
        data: {
            user: Object.assign(Object.assign({}, user.toJSON()), { isFollowing }),
        },
    });
});
exports.default = getUserById;
