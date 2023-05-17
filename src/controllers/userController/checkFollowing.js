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
const AppError_1 = __importDefault(require("../../utils/AppError"));
const Follow_1 = __importDefault(require("../../models/Follow"));
const checkFollowing = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId: userToFollowId } = req.params;
    const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userToFollowId) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.noUser'), constants_1.NOT_FOUND));
    }
    const isFollowing = (yield Follow_1.default.findOne({
        follower: currentUserId,
        following: userToFollowId,
    }))
        ? true
        : false;
    res.status(constants_1.OK).json({
        success: true,
        data: {
            isFollowing,
        },
    });
});
exports.default = checkFollowing;
