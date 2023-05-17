"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../../controllers/userController");
const checkAuthenticated_1 = __importDefault(require("../../middleware/checkAuthenticated"));
const router = (0, express_1.Router)();
router.get('/:userId', (0, checkAuthenticated_1.default)(), userController_1.getUserById);
exports.default = router;
