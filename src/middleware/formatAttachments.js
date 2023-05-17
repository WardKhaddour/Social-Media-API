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
const promises_1 = __importDefault(require("fs/promises"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const formatAttachments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const attachments = [];
    if (!req.files) {
        return next();
    }
    for (const file of req.files) {
        //Format images
        if (file.mimetype.includes('image')) {
            file.filename = `post-postId-user-${(_a = req.user) === null || _a === void 0 ? void 0 : _a.id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpeg`;
            const photo = (yield jimp_1.default.read(file.buffer)).resize(500, 500).quality(90);
            const filePath = `posts/images/${file.filename}`;
            attachments.push({
                fileName: file.originalname,
                type: 'image',
                filePath,
                pathToSave: `public/${filePath}`,
                file: photo,
            });
        }
        //Format PDF
        else if (file.mimetype.includes('pdf')) {
            file.filename = `post-postId-user-${(_b = req.user) === null || _b === void 0 ? void 0 : _b.id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.pdf`;
            const filePath = `posts/pdf/${file.filename}`;
            attachments.push({
                fileName: file.originalname,
                type: 'pdf',
                filePath,
                pathToSave: `public/${filePath}`,
                file: file.buffer,
            });
        }
        // Format Videos
        else if (file.mimetype.includes('video')) {
            file.filename = `post-postId-user-${(_c = req.user) === null || _c === void 0 ? void 0 : _c.id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
            const tempFilePath = `public/posts/videos/${file.filename}`;
            yield promises_1.default.writeFile(tempFilePath, file.buffer);
            const saveVideo = (filePath) => {
                return new Promise((resolve, reject) => {
                    const processedVideo = (0, fluent_ffmpeg_1.default)(tempFilePath)
                        .size('640x360')
                        .videoCodec('libx264')
                        .audioCodec('aac')
                        .format('mp4')
                        .output(filePath);
                    processedVideo.on('end', () => __awaiter(void 0, void 0, void 0, function* () {
                        yield promises_1.default.unlink(tempFilePath);
                        resolve();
                    }));
                    processedVideo.on('error', (err) => __awaiter(void 0, void 0, void 0, function* () {
                        yield promises_1.default.unlink(tempFilePath);
                        reject(err);
                    }));
                    processedVideo.run();
                });
            };
            const filePath = `posts/videos/${file.filename}.mp4`;
            attachments.push({
                fileName: file.originalname,
                type: 'video',
                filePath: `posts/videos/${file.filename}.mp4`,
                pathToSave: `public/${filePath}`,
                saveFile: saveVideo,
            });
        }
    }
    req.attachments = attachments;
    next();
});
exports.default = formatAttachments;
