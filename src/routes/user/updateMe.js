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
const uploadUserPhoto_1 = __importDefault(require("../../middleware/uploadUserPhoto"));
const resizeUserPhoto_1 = __importDefault(require("../../middleware/resizeUserPhoto"));
const router = (0, express_1.Router)();
router.patch('/', uploadUserPhoto_1.default, (0, express_validator_1.body)('email')
    .optional({ checkFalsy: false })
    .isEmail()
    .withMessage('Please provide a valid E-Mail'), (0, express_validator_1.body)('name').optional({ checkFalsy: false }), (0, restrictAuthenticated_1.default)(), validateRequest_1.default, resizeUserPhoto_1.default, userController_1.updateMe);
exports.default = router;
