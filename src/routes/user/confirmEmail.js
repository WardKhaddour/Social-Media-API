"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const userController_1 = require("../../controllers/userController");
const router = (0, express_1.Router)();
router.patch('/confirm-email/:token', userController_1.confirmEmail);
router.post('/resend-confirm-token', (0, express_validator_1.body)('email').isEmail(), validateRequest_1.default, userController_1.resendConfirmToken);
exports.default = router;
