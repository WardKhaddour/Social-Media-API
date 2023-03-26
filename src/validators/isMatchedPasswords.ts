import { Meta } from 'express-validator';

const isMatchedPasswords = (
  value: string | undefined,
  { req }: Meta
): boolean => {
  if (value !== req.body.password) {
    throw new Error('Password confirmation does not match password');
  }
  return true;
};

export default isMatchedPasswords;
