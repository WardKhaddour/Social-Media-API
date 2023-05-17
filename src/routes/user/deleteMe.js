"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const userController_1 = require("./../../controllers/userController");
const restrictAuthenticated_1 = __importDefault(require("../../middleware/restrictAuthenticated"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const router = (0, express_1.Router)();
router.delete('/', (0, express_validator_1.body)('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters long'), validateRequest_1.default, (0, restrictAuthenticated_1.default)({ withPassword: true }), userController_1.deleteMe);
exports.default = router;
