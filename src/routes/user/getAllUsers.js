"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aliasMostPopularUsers_1 = __importDefault(require("../../controllers/userController/aliasMostPopularUsers"));
const userController_1 = require("./../../controllers/userController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', userController_1.getAllUsers);
router.get('/most-popular', aliasMostPopularUsers_1.default, userController_1.getAllUsers);
exports.default = router;
