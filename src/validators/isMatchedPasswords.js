"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isMatchedPasswords = (value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
    }
    return true;
};
exports.default = isMatchedPasswords;
