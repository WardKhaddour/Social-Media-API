"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./../../controllers/categoryController/index");
const express_1 = require("express");
const restrictAuthenticated_1 = __importDefault(require("../../middleware/restrictAuthenticated"));
const restrictTo_1 = __importDefault(require("../../middleware/restrictTo"));
const express_validator_1 = require("express-validator");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const router = (0, express_1.Router)();
router
    .route('/')
    .get(index_1.getAllCategories)
    .post((0, restrictAuthenticated_1.default)(), (0, restrictTo_1.default)('admin'), (0, express_validator_1.body)('name').isString().withMessage('Category name must be a string'), validateRequest_1.default, index_1.addNewCategory);
router
    .route('/:categoryId')
    .patch((0, restrictAuthenticated_1.default)(), (0, restrictTo_1.default)('admin'), (0, express_validator_1.body)('name').isString().withMessage('Category name must be a string'), validateRequest_1.default, index_1.updateCategory)
    .delete((0, restrictAuthenticated_1.default)(), (0, restrictTo_1.default)('admin'), index_1.deleteCategory);
exports.default = router;
