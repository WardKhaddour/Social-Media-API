"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = require("../../controllers/authController");
const isMatchedPasswords_1 = __importDefault(require("../../validators/isMatchedPasswords"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const restrictHuman_1 = __importDefault(require("../../middleware/restrictHuman"));
const router = (0, express_1.Router)();
router.post('/signup', restrictHuman_1.default, (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid E-Mail'), (0, express_validator_1.body)('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters long'), (0, express_validator_1.body)('confirmPassword').custom(isMatchedPasswords_1.default), validateRequest_1.default, authController_1.signup);
exports.default = router;
