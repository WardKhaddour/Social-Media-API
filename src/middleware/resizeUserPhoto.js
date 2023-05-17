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
const jimp_1 = __importDefault(require("jimp"));
const resizeUserPhoto = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.file)
        return next();
    req.file.filename = `user-${(_a = req.user) === null || _a === void 0 ? void 0 : _a.id}-${Date.now()}.jpeg`;
    const photo = yield jimp_1.default.read(req.file.buffer);
    photo.resize(500, 500).quality(90);
    yield photo.writeAsync(`public/images/users/${req.file.filename}`);
    next();
});
exports.default = resizeUserPhoto;
