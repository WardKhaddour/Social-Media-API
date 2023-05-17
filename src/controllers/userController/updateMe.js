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
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Email_1 = __importDefault(require("../../utils/Email"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const constants_1 = require("../../constants");
const file_1 = require("../../utils/file");
const updateMe = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, name, bio } = req.body;
    const user = req.user;
    let photo = null;
    let oldPhotoPath = null;
    if (req.file) {
        photo = req.file.filename;
        if (user.photoSrc !== 'default-user-photo.png') {
            oldPhotoPath = `public/images/users/${(_a = req.user) === null || _a === void 0 ? void 0 : _a.photoSrc}`;
        }
    }
    let resMessage = req.i18n.t('userAuthMsg.userUpdated');
    if (email && user.email !== email) {
        user.email = email;
        user.emailIsConfirmed = false;
        resMessage += req.i18n.t('userAuthMsg.confirmNewEmail');
        const confirmToken = user.createEmailConfirmToken();
        try {
            const email = new Email_1.default(user.email, confirmToken);
            yield email.sendEmailConfirm();
        }
        catch (error) {
            user.emailConfirmToken = undefined;
            user.emailConfirmExpires = undefined;
            yield user.save({ validateBeforeSave: false });
            return next(new AppError_1.default(req.i18n.t('userAuthMsg.serverErrorOccurred'), constants_1.SERVER_ERROR));
        }
    }
    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.photoSrc = photo || user.photoSrc;
    yield user.save({ validateBeforeSave: false });
    if (photo && oldPhotoPath) {
        (0, file_1.deleteFile)(oldPhotoPath);
    }
    res.status(constants_1.OK).json({
        success: true,
        message: resMessage,
        data: {
            user: {
                _id: user._id,
                name: user.name,
                bio: user.bio,
                email: user.email,
                photo: user.photo,
                emailIsConfirmed: user.emailIsConfirmed,
                hasPhoto: user.photoSrc !== 'default-user-photo.png',
            },
        },
    });
}));
exports.default = updateMe;
