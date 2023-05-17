"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const logout = (req, res, next) => {
    res.clearCookie('jwt');
    res.status(constants_1.OK).json({
        success: true,
        message: req.i18n.t('userAuthMsg.loggedOutSuccess'),
        data: null,
    });
};
exports.default = logout;
