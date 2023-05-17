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
const promises_1 = __importDefault(require("fs/promises"));
const savePostAttachments = (req, post) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { attachments } = req;
    if (attachments) {
        for (const attachedFile of attachments) {
            attachedFile.filePath = attachedFile.filePath.replace('postId', post._id.toString());
            attachedFile.pathToSave = attachedFile.pathToSave.replace('postId', post._id.toString());
            if (attachedFile.type === 'image') {
                yield attachedFile.file.writeAsync(attachedFile.pathToSave);
            }
            else if (attachedFile.type === 'pdf') {
                yield promises_1.default.writeFile(attachedFile.pathToSave, attachedFile.file);
            }
            else if (attachedFile.type === 'video') {
                if (attachedFile.saveFile)
                    yield attachedFile.saveFile(attachedFile.pathToSave);
            }
            (_a = post.attachment) === null || _a === void 0 ? void 0 : _a.push({
                fileName: attachedFile.fileName,
                filePath: attachedFile.filePath,
                type: attachedFile.type,
            });
        }
    }
});
exports.default = savePostAttachments;
