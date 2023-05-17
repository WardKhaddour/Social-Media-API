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
const User_1 = __importDefault(require("../../models/User"));
const constants_1 = require("../../constants");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const createAndSendToken_1 = __importDefault(require("../../utils/createAndSendToken"));
const mongodb_1 = require("mongodb");
const updatePassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { currentPassword, password } = req.body;
    if (!mongodb_1.ObjectId.isValid((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.serverError'), constants_1.SERVER_ERROR));
    }
    const user = yield User_1.default.findById((_b = req.user) === null || _b === void 0 ? void 0 : _b._id).select('+password');
    if (!user ||
        !(yield user.isCorrectPassword(currentPassword, user.password))) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.currentPasswordWrong'), constants_1.UNAUTHORIZED));
    }
    user.password = password;
    yield user.save();
    (0, createAndSendToken_1.default)(user, constants_1.OK, req.i18n.t('userAuthMsg.changedPassword'), req, res);
}));
exports.default = updatePassword;
