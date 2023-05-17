"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.signup = exports.login = void 0;
var login_1 = require("./login");
Object.defineProperty(exports, "login", { enumerable: true, get: function () { return __importDefault(login_1).default; } });
var signup_1 = require("./signup");
Object.defineProperty(exports, "signup", { enumerable: true, get: function () { return __importDefault(signup_1).default; } });
var forgotPassword_1 = require("./forgotPassword");
Object.defineProperty(exports, "forgotPassword", { enumerable: true, get: function () { return __importDefault(forgotPassword_1).default; } });
var resetPassword_1 = require("./resetPassword");
Object.defineProperty(exports, "resetPassword", { enumerable: true, get: function () { return __importDefault(resetPassword_1).default; } });
