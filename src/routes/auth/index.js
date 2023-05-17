"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const signup_1 = __importDefault(require("./signup"));
const login_1 = __importDefault(require("./login"));
const forgotPassword_1 = __importDefault(require("./forgotPassword"));
const resetPassword_1 = __importDefault(require("./resetPassword"));
const router = (0, express_1.Router)();
router.use(login_1.default);
router.use(signup_1.default);
router.use(forgotPassword_1.default);
router.use(resetPassword_1.default);
exports.default = router;
