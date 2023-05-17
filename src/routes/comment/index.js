"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commentController_1 = require("./../../controllers/commentController");
const express_1 = require("express");
const restrictAuthenticated_1 = __importDefault(require("../../middleware/restrictAuthenticated"));
const commentController_2 = require("../../controllers/commentController");
const router = (0, express_1.Router)({ mergeParams: true });
router
    .route('/')
    .get(commentController_1.getCommentsOnPost)
    .post((0, restrictAuthenticated_1.default)(), commentController_2.addNewComment);
router
    .route('/:commentId')
    .patch((0, restrictAuthenticated_1.default)(), commentController_1.updateComment)
    .delete((0, restrictAuthenticated_1.default)(), commentController_1.deleteComment);
exports.default = router;
