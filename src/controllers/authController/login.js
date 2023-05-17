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
const User_1 = __importDefault(require("../../models/User"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const constants_1 = require("../../constants");
const createAndSendToken_1 = __importDefault(require("../../utils/createAndSendToken"));
const login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.default.findOne({ email }).select('+password');
    if (!user) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.invalidCredentials'), constants_1.UNAUTHORIZED));
    }
    if (user.cannotTryLogin()) {
        const remainingTime = ((user.loginAttemptsAt.getTime() - Date.now()) /
            (1000 * 60)).toFixed(2);
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.timeToLogin', { remainingTime }), constants_1.UNAUTHORIZED));
    }
    const isCorrectPassword = yield user.isCorrectPassword(password, user.password);
    if (!isCorrectPassword) {
        yield user.handleLoginAttemptFail();
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.failedLogin', {
            remaining: user.totalLoginAttempts,
        }), constants_1.UNAUTHORIZED));
    }
    yield user.resetTotalAttempts();
    (0, createAndSendToken_1.default)(user, constants_1.OK, req.i18n.t('userAuthMsg.loggedIn'), req, res);
}));
exports.default = login;
