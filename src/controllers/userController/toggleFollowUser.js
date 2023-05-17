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
const Follow_1 = __importDefault(require("../../models/Follow"));
const constants_2 = require("../../constants");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const mongodb_1 = require("mongodb");
const toggleFollowUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { userId: userToFollowId } = req.params;
    if (!mongodb_1.ObjectId.isValid(userToFollowId)) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.serverError'), constants_1.SERVER_ERROR));
    }
    if (user._id.equals(userToFollowId)) {
        return next(new AppError_1.default(req.i18n.t('followMsg.noFollowYourself'), constants_1.BAD_REQUEST));
    }
    User_1.default.findById(userToFollowId);
    const [isFollowing, userToFollow] = yield Promise.all([
        Follow_1.default.findOne({
            follower: user._id,
            following: userToFollowId,
        }),
        User_1.default.findById(userToFollowId),
    ]);
    if (!userToFollow) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.noUser'), constants_1.NOT_FOUND));
    }
    if (isFollowing) {
        user.followingNum--;
        userToFollow.followersNum--;
        const [, updatedUser, updatedUserToFollow] = yield Promise.all([
            isFollowing.deleteOne(),
            user.save(),
            userToFollow.save(),
        ]);
        return res.status(constants_2.OK).json({
            success: true,
            message: req.i18n.t('followMsg.unfollowedUserSuccess', {
                name: userToFollow.name,
            }),
            data: {
                userToFollow: {
                    followers: userToFollow.followersNum,
                },
                user: {
                    following: user.followingNum,
                },
            },
        });
    }
    user.followingNum++;
    userToFollow.followersNum++;
    const [, updatedUser, updatedUserToFollow] = yield Promise.all([
        Follow_1.default.create({ follower: user._id, following: userToFollowId }),
        user.save(),
        userToFollow.save(),
    ]);
    return res.status(constants_2.OK).json({
        success: true,
        message: req.i18n.t('followMsg.followedUserSuccess', {
            name: userToFollow.name,
        }),
        data: {
            userToFollow: {
                followers: userToFollow.followersNum,
            },
            user: {
                following: user.followingNum,
            },
        },
    });
});
exports.default = toggleFollowUser;
