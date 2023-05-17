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
const User_1 = __importDefault(require("../../models/User"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const createAndSendToken_1 = __importDefault(require("../../utils/createAndSendToken"));
const crypto_1 = __importDefault(require("crypto"));
const confirmEmail = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedToken = crypto_1.default
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = yield User_1.default.findOne({
        emailConfirmToken: hashedToken,
        emailConfirmExpires: { $gt: Date.now() },
    });
    if (!user) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.invalidExpiredToken'), constants_1.BAD_REQUEST));
    }
    user.emailIsConfirmed = true;
    user.emailConfirmToken = undefined;
    user.emailConfirmExpires = undefined;
    yield user.save();
    (0, createAndSendToken_1.default)(user, constants_1.OK, req.i18n.t('userAuthMsg.welcome'), req, res);
}));
exports.default = confirmEmail;
