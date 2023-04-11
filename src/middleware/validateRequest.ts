import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { VALIDATION_ERROR } from '../constants';

const msgValidationResult = validationResult.withDefaults({
  formatter: error => ({ filed: error.param, error: error.msg }),
});

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = msgValidationResult(req);

  if (!errors.isEmpty())
    return res.status(VALIDATION_ERROR).json({
      success: false,
      message: req.i18n.t('msg.invalidData'),
      data: {
        errors: errors.array(),
      },
    });

  next();
};

export default validateRequest;
