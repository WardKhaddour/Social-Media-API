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
const AppError_1 = __importDefault(require("../../utils/AppError"));
const constants_1 = require("../../constants");
const deleteMe = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const user = req.user;
    if (!(yield user.isCorrectPassword(password, user.password))) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.incorrectPassword'), constants_1.UNAUTHORIZED));
    }
    user.active = false;
    user.emailIsConfirmed = false;
    user.name = 'Deleted Account';
    user.photo = undefined;
    yield user.save();
    res.status(constants_1.DELETED).json({
        success: false,
    });
}));
exports.default = deleteMe;
