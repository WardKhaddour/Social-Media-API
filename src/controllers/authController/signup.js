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
const sendEmailConfirmationLink_1 = __importDefault(require("../../utils/sendEmailConfirmationLink"));
const createAndSendToken_1 = __importDefault(require("../../utils/createAndSendToken"));
const signup = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const query = User_1.default.findOne({ email }).select('+active');
    query.setOptions({
        disableMiddleware: true,
    });
    let user = yield query.exec();
    if (user && user.active) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.usedEmail'), constants_1.BAD_REQUEST));
    }
    if (!user) {
        user = yield User_1.default.create({ name, email, password });
    }
    else {
        user.name = name;
        user.active = true;
        yield user.save();
    }
    yield (0, sendEmailConfirmationLink_1.default)(user, req, next);
    (0, createAndSendToken_1.default)(user, constants_1.OK, req.i18n.t('userAuthMsg.createdAccountSuccess'), req, res);
}));
exports.default = signup;
