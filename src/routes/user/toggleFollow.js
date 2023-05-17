"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("./../../controllers/userController");
const restrictAuthenticated_1 = __importDefault(require("../../middleware/restrictAuthenticated"));
const router = (0, express_1.Router)();
router.patch('/follow/:userId', (0, restrictAuthenticated_1.default)(), userController_1.toggleFollowUser);
exports.default = router;
