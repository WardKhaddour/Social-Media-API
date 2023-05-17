"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const constants_1 = require("../constants");
const msgValidationResult = express_validator_1.validationResult.withDefaults({
    formatter: error => ({ filed: error.param, error: error.msg }),
});
const validateRequest = (req, res, next) => {
    const errors = msgValidationResult(req);
    if (!errors.isEmpty())
        return res.status(constants_1.VALIDATION_ERROR).json({
            success: false,
            message: req.i18n.t('userAuthMsg.invalidData'),
            data: {
                errors: errors.array(),
            },
        });
    next();
};
exports.default = validateRequest;
