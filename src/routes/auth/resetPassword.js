"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = require("../../controllers/authController");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const isMatchedPasswords_1 = __importDefault(require("../../validators/isMatchedPasswords"));
const router = (0, express_1.Router)();
router.patch('/reset-password/:token', (0, express_validator_1.body)('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters long'), (0, express_validator_1.body)('confirmPassword').custom(isMatchedPasswords_1.default), validateRequest_1.default, authController_1.resetPassword);
exports.default = router;
