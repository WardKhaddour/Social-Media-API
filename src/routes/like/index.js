"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const restrictAuthenticated_1 = __importDefault(require("../../middleware/restrictAuthenticated"));
const likeController_1 = require("../../controllers/likeController");
const router = (0, express_1.Router)({ mergeParams: true });
router.route('/').all((0, restrictAuthenticated_1.default)()).post(likeController_1.toggleLike);
exports.default = router;
