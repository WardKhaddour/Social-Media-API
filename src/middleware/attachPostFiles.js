"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const constants_1 = require("../constants");
const AppError_1 = __importDefault(require("../utils/AppError"));
const multerStorage = multer_1.default.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.includes('image') ||
        file.mimetype.includes('pdf') ||
        file.mimetype.includes('video')) {
        cb(null, true);
    }
    else {
        cb(new AppError_1.default(req.i18n.t('userAuthMsg.notSupportedType'), constants_1.BAD_REQUEST));
    }
};
const upload = (0, multer_1.default)({
    storage: multerStorage,
    limits: {
        fileSize: 1024 * 1024 * 10, // 10MB Maximum file size
    },
    fileFilter: multerFilter,
});
exports.default = upload.array('attachments', 3);
