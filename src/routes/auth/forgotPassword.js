"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = require("../../controllers/authController");
const restrictHuman_1 = __importDefault(require("../../middleware/restrictHuman"));
const router = (0, express_1.Router)();
router.post('/forgot-password', restrictHuman_1.default, (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid E-Mail'), authController_1.forgotPassword);
exports.default = router;
