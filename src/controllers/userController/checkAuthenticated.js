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
const constants_1 = require("../../constants");
const checkAuthenticated = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.status(constants_1.OK).json({
        success: true,
        message: req.i18n.t('userAuthMsg.welcome'),
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
exports.default = checkAuthenticated;
