"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FollowSchema = new mongoose_1.default.Schema({
    follower: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    following: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
});
const Follow = mongoose_1.default.model('Follow', FollowSchema);
exports.default = Follow;
