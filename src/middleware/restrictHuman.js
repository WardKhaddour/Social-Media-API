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
const validateHuman_1 = __importDefault(require("../utils/validateHuman"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const constants_1 = require("../constants");
const restrictHuman = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return next();
    if (process.env.NODE_ENV === 'development') {
        return next();
    }
    const { recaptchaToken } = req.body;
    const isHuman = yield (0, validateHuman_1.default)(recaptchaToken);
    if (!isHuman) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.bot'), constants_1.BAD_REQUEST));
    }
    next();
});
exports.default = restrictHuman;
